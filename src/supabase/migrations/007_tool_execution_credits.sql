-- Migration: Tool Execution and Credit System
-- Description: Add tables and functions for tool execution tracking and credit management
-- Version: 007
-- Date: 2026-01-12

-- ============================================================================
-- USER CREDITS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_credits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  available INTEGER NOT NULL DEFAULT 1000,
  used INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 1000,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  reset_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_tier ON user_credits(tier);

-- ============================================================================
-- TOOL USAGE HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS tool_usage_history (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  result JSONB,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'cancelled')),
  credits_consumed INTEGER NOT NULL DEFAULT 0,
  processing_time INTEGER NOT NULL DEFAULT 0, -- in milliseconds
  model TEXT,
  provider TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_id ON tool_usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_tool_id ON tool_usage_history(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_usage_created_at ON tool_usage_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_usage_status ON tool_usage_history(status);
CREATE INDEX IF NOT EXISTS idx_tool_usage_user_created ON tool_usage_history(user_id, created_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to initialize credits for new users
CREATE OR REPLACE FUNCTION initialize_user_credits()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_credits (user_id, available, used, total, tier, reset_date)
  VALUES (
    NEW.id,
    1000,  -- Free tier default
    0,
    1000,
    'free',
    NOW() + INTERVAL '30 days'
  )
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-initialize credits when user signs up
DROP TRIGGER IF EXISTS trigger_initialize_user_credits ON auth.users;
CREATE TRIGGER trigger_initialize_user_credits
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_credits();

-- Function to consume credits
CREATE OR REPLACE FUNCTION consume_credits(
  p_user_id UUID,
  p_amount INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
  v_tier TEXT;
BEGIN
  -- Get current credits and tier
  SELECT available, tier INTO v_available, v_tier
  FROM user_credits
  WHERE user_id = p_user_id
  FOR UPDATE; -- Lock the row
  
  -- Check if user exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User credits not found';
  END IF;
  
  -- Enterprise users have unlimited credits
  IF v_tier = 'enterprise' THEN
    -- Still track usage for enterprise
    UPDATE user_credits
    SET used = used + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;
    RETURN TRUE;
  END IF;
  
  -- Check if user has enough credits
  IF v_available < p_amount THEN
    RETURN FALSE;
  END IF;
  
  -- Consume credits
  UPDATE user_credits
  SET available = available - p_amount,
      used = used + p_amount,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly credits
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
BEGIN
  -- Reset credits for users whose reset_date has passed
  UPDATE user_credits
  SET available = total,
      used = 0,
      reset_date = reset_date + INTERVAL '30 days',
      updated_at = NOW()
  WHERE reset_date <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to upgrade user tier
CREATE OR REPLACE FUNCTION upgrade_user_tier(
  p_user_id UUID,
  p_new_tier TEXT,
  p_new_total INTEGER
)
RETURNS void AS $$
BEGIN
  UPDATE user_credits
  SET tier = p_new_tier,
      total = p_new_total,
      available = p_new_total - used,
      updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user credit stats
CREATE OR REPLACE FUNCTION get_user_credit_stats(p_user_id UUID)
RETURNS TABLE (
  available INTEGER,
  used INTEGER,
  total INTEGER,
  tier TEXT,
  reset_date TIMESTAMP WITH TIME ZONE,
  usage_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uc.available,
    uc.used,
    uc.total,
    uc.tier,
    uc.reset_date,
    CASE 
      WHEN uc.total > 0 THEN ROUND((uc.used::NUMERIC / uc.total::NUMERIC) * 100, 2)
      ELSE 0
    END as usage_percentage
  FROM user_credits uc
  WHERE uc.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get tool usage statistics
CREATE OR REPLACE FUNCTION get_tool_usage_stats(p_user_id UUID)
RETURNS TABLE (
  total_executions BIGINT,
  successful_executions BIGINT,
  failed_executions BIGINT,
  total_credits_consumed BIGINT,
  average_processing_time NUMERIC,
  most_used_tool TEXT,
  most_used_tool_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT 
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'success') as successful,
      COUNT(*) FILTER (WHERE status = 'failed') as failed,
      SUM(credits_consumed) as credits,
      AVG(processing_time) as avg_time
    FROM tool_usage_history
    WHERE user_id = p_user_id
  ),
  top_tool AS (
    SELECT tool_name, COUNT(*) as count
    FROM tool_usage_history
    WHERE user_id = p_user_id
    GROUP BY tool_name
    ORDER BY count DESC
    LIMIT 1
  )
  SELECT 
    COALESCE(s.total, 0),
    COALESCE(s.successful, 0),
    COALESCE(s.failed, 0),
    COALESCE(s.credits, 0),
    COALESCE(ROUND(s.avg_time::NUMERIC, 2), 0),
    COALESCE(t.tool_name, ''),
    COALESCE(t.count, 0)
  FROM stats s
  FULL OUTER JOIN top_tool t ON true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on tables
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage_history ENABLE ROW LEVEL SECURITY;

-- User Credits Policies
CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own credits"
  ON user_credits FOR UPDATE
  USING (auth.uid() = user_id);

-- Tool Usage History Policies
CREATE POLICY "Users can view own usage history"
  ON tool_usage_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage history"
  ON tool_usage_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can do anything (for server-side operations)
CREATE POLICY "Service role full access to credits"
  ON user_credits FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to usage"
  ON tool_usage_history FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Initialize credits for existing users
INSERT INTO user_credits (user_id, available, used, total, tier, reset_date)
SELECT 
  id,
  1000,
  0,
  1000,
  'free',
  NOW() + INTERVAL '30 days'
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE user_credits IS 'Stores user credit balances for AI tool usage';
COMMENT ON TABLE tool_usage_history IS 'Tracks all tool executions for analytics and billing';
COMMENT ON FUNCTION consume_credits IS 'Safely consume credits with transaction support';
COMMENT ON FUNCTION reset_monthly_credits IS 'Reset credits on monthly schedule (call via cron)';
COMMENT ON FUNCTION upgrade_user_tier IS 'Upgrade user subscription tier and credit limits';
COMMENT ON FUNCTION get_user_credit_stats IS 'Get detailed credit statistics for a user';
COMMENT ON FUNCTION get_tool_usage_stats IS 'Get tool usage analytics for a user';
