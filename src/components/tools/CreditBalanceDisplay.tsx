import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useUserCredits } from '../../hooks/useToolExecution';
import { CreditCard, TrendingUp, Calendar, Zap } from 'lucide-react';

interface CreditBalanceDisplayProps {
  userId: string;
  onUpgrade?: () => void;
}

/**
 * Credit Balance Display Component
 * Shows user's credit balance, usage, and tier information
 */
export const CreditBalanceDisplay: React.FC<CreditBalanceDisplayProps> = ({
  userId,
  onUpgrade,
}) => {
  const { credits, loading, fetchCredits } = useUserCredits(userId);

  useEffect(() => {
    if (userId) {
      fetchCredits();
    }
  }, [userId, fetchCredits]);

  if (loading || !credits) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = (credits.used / credits.total) * 100;
  const isLowBalance = credits.available < credits.total * 0.2;

  return (
    <Card className="w-full" style={{ backgroundColor: 'var(--ff-surface)' }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" style={{ color: 'var(--ff-primary)' }} />
            <CardTitle style={{ color: 'var(--ff-text-primary)' }}>
              Credit Balance
            </CardTitle>
          </div>
          <Badge
            variant={credits.tier === 'free' ? 'secondary' : 'default'}
            style={{
              backgroundColor:
                credits.tier === 'enterprise'
                  ? 'var(--ff-primary)'
                  : credits.tier === 'pro'
                  ? 'var(--ff-secondary)'
                  : 'var(--ff-surface-hover)',
              color: 'var(--ff-text-primary)',
            }}
          >
            {credits.tier.toUpperCase()}
          </Badge>
        </div>
        <CardDescription style={{ color: 'var(--ff-text-secondary)' }}>
          Track your AI tool usage and credits
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Available Credits */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span style={{ color: 'var(--ff-text-secondary)', fontSize: 'var(--ff-text-sm)' }}>
              Available Credits
            </span>
            <div className="flex items-baseline gap-1">
              <span
                style={{
                  color: isLowBalance ? 'var(--ff-error-500)' : 'var(--ff-primary)',
                  fontSize: 'var(--ff-text-3xl)',
                  fontWeight: 'var(--ff-weight-bold)',
                }}
              >
                {credits.available.toLocaleString()}
              </span>
              {credits.tier !== 'enterprise' && (
                <span style={{ color: 'var(--ff-text-muted)', fontSize: 'var(--ff-text-sm)' }}>
                  / {credits.total.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {credits.tier !== 'enterprise' && (
            <Progress
              value={((credits.available / credits.total) * 100)}
              className="h-2"
              style={{
                backgroundColor: 'var(--ff-surface-hover)',
              }}
            />
          )}
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--ff-surface-hover)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--ff-primary)' }} />
              <span style={{ color: 'var(--ff-text-secondary)', fontSize: 'var(--ff-text-xs)' }}>
                Used
              </span>
            </div>
            <div
              style={{
                color: 'var(--ff-text-primary)',
                fontSize: 'var(--ff-text-xl)',
                fontWeight: 'var(--ff-weight-semibold)',
              }}
            >
              {credits.used.toLocaleString()}
            </div>
            <div style={{ color: 'var(--ff-text-muted)', fontSize: 'var(--ff-text-xs)' }}>
              {usagePercentage.toFixed(1)}% of total
            </div>
          </div>

          <div
            className="p-3 rounded-lg"
            style={{
              backgroundColor: 'var(--ff-surface-hover)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4" style={{ color: 'var(--ff-primary)' }} />
              <span style={{ color: 'var(--ff-text-secondary)', fontSize: 'var(--ff-text-xs)' }}>
                Resets
              </span>
            </div>
            <div
              style={{
                color: 'var(--ff-text-primary)',
                fontSize: 'var(--ff-text-sm)',
                fontWeight: 'var(--ff-weight-semibold)',
              }}
            >
              {new Date(credits.resetDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <div style={{ color: 'var(--ff-text-muted)', fontSize: 'var(--ff-text-xs)' }}>
              {Math.ceil(
                (new Date(credits.resetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )}{' '}
              days left
            </div>
          </div>
        </div>

        {/* Warning Message */}
        {isLowBalance && credits.tier !== 'enterprise' && (
          <div
            className="p-3 rounded-lg flex items-start gap-3"
            style={{
              backgroundColor: 'rgba(255, 123, 0, 0.1)',
              border: '1px solid rgba(255, 123, 0, 0.3)',
            }}
          >
            <Zap className="w-5 h-5 mt-0.5" style={{ color: 'var(--ff-warning-500)' }} />
            <div className="flex-1">
              <p
                style={{
                  color: 'var(--ff-warning-500)',
                  fontSize: 'var(--ff-text-sm)',
                  fontWeight: 'var(--ff-weight-medium)',
                  marginBottom: '4px',
                }}
              >
                Low Credit Balance
              </p>
              <p style={{ color: 'var(--ff-text-secondary)', fontSize: 'var(--ff-text-xs)' }}>
                You're running low on credits. Upgrade to continue using AI tools without
                interruption.
              </p>
            </div>
          </div>
        )}

        {/* Upgrade Button */}
        {credits.tier === 'free' && onUpgrade && (
          <Button
            onClick={onUpgrade}
            className="w-full"
            style={{
              backgroundColor: 'var(--ff-primary)',
              color: 'white',
              fontWeight: 'var(--ff-weight-semibold)',
            }}
          >
            Upgrade to Pro
          </Button>
        )}

        {/* Enterprise Note */}
        {credits.tier === 'enterprise' && (
          <div
            className="text-center p-2 rounded"
            style={{
              backgroundColor: 'var(--ff-surface-hover)',
              color: 'var(--ff-text-secondary)',
              fontSize: 'var(--ff-text-xs)',
            }}
          >
            ✨ You have unlimited credits with Enterprise
          </div>
        )}
      </CardContent>
    </Card>
  );
};
