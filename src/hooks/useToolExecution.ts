import { useState, useCallback } from 'react';
import { ToolExecutionService, type ToolExecutionRequest, type ToolExecutionResult, type ToolUsageRecord, type UserCredits } from '../services/ToolExecutionService';
import { toast } from 'sonner';

/**
 * React hook for tool execution with credit tracking
 * Provides easy integration with React components
 */
export function useToolExecution() {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Execute a tool
   */
  const executeTool = useCallback(async (request: ToolExecutionRequest) => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const executionResult = await ToolExecutionService.executeTool(request);
      setResult(executionResult);

      if (!executionResult.success) {
        setError(executionResult.error || 'Tool execution failed');
      }

      return executionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`Execution failed: ${errorMessage}`);
      return null;
    } finally {
      setIsExecuting(false);
    }
  }, []);

  /**
   * Get tool cost
   */
  const getToolCost = useCallback((toolId: string) => {
    return ToolExecutionService.getToolCost(toolId);
  }, []);

  return {
    executeTool,
    getToolCost,
    isExecuting,
    result,
    error,
  };
}

/**
 * React hook for user credits management
 */
export function useUserCredits(userId: string) {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch user credits
   */
  const fetchCredits = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const userCredits = await ToolExecutionService.getUserCredits(userId);
      setCredits(userCredits);
    } catch (err) {
      console.error('Failed to fetch credits:', err);
      toast.error('Failed to load credit balance');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Check if user has enough credits
   */
  const hasCredits = useCallback(async (amount: number) => {
    if (!userId) return false;
    return await ToolExecutionService.hasCredits(userId, amount);
  }, [userId]);

  return {
    credits,
    loading,
    fetchCredits,
    hasCredits,
  };
}

/**
 * React hook for tool usage history
 */
export function useToolHistory(userId: string) {
  const [history, setHistory] = useState<ToolUsageRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Fetch usage history
   */
  const fetchHistory = useCallback(async (limit?: number) => {
    if (!userId) return;

    setLoading(true);
    try {
      const userHistory = await ToolExecutionService.getUserHistory(userId, limit);
      setHistory(userHistory);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      toast.error('Failed to load usage history');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Fetch usage statistics
   */
  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const userStats = await ToolExecutionService.getUserStats(userId);
      setStats(userStats);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    history,
    stats,
    loading,
    fetchHistory,
    fetchStats,
  };
}
