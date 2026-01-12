import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToolHistory } from '../../hooks/useToolExecution';
import {
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Zap,
  Calendar,
  BarChart3,
} from 'lucide-react';
import type { ToolUsageRecord } from '../../services/ToolExecutionService';

interface ToolUsageHistoryProps {
  userId: string;
}

/**
 * Tool Usage History Component
 * Displays user's tool execution history and statistics
 */
export const ToolUsageHistory: React.FC<ToolUsageHistoryProps> = ({ userId }) => {
  const { history, stats, loading, fetchHistory, fetchStats } = useToolHistory(userId);
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    if (userId) {
      fetchHistory();
      fetchStats();
    }
  }, [userId, fetchHistory, fetchStats]);

  if (loading && history.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full" style={{ backgroundColor: 'var(--ff-surface)' }}>
      <CardHeader>
        <CardTitle style={{ color: 'var(--ff-text-primary)' }}>Tool Usage</CardTitle>
        <CardDescription style={{ color: 'var(--ff-text-secondary)' }}>
          View your tool execution history and statistics
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4 mt-4">
            {history.length === 0 ? (
              <div
                className="text-center py-12"
                style={{ color: 'var(--ff-text-secondary)' }}
              >
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tool usage history yet</p>
                <p className="text-sm mt-2">Start using AI tools to see your history here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((record) => (
                  <ToolUsageCard key={record.id} record={record} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats" className="space-y-4 mt-4">
            {stats ? (
              <div className="space-y-6">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon={<Zap />}
                    label="Total Executions"
                    value={stats.totalExecutions.toLocaleString()}
                    color="var(--ff-primary)"
                  />
                  <StatCard
                    icon={<CheckCircle />}
                    label="Success Rate"
                    value={`${stats.successRate.toFixed(1)}%`}
                    color="var(--ff-success-500)"
                  />
                  <StatCard
                    icon={<Award />}
                    label="Credits Used"
                    value={stats.totalCreditsUsed.toLocaleString()}
                    color="var(--ff-secondary)"
                  />
                  <StatCard
                    icon={<Clock />}
                    label="Avg Time"
                    value={`${(stats.averageProcessingTime / 1000).toFixed(1)}s`}
                    color="var(--ff-info-500)"
                  />
                </div>

                {/* Most Used Tools */}
                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: 'var(--ff-text-primary)' }}
                  >
                    Most Used Tools
                  </h3>
                  <div className="space-y-2">
                    {stats.mostUsedTools.map((tool: any, index: number) => (
                      <div
                        key={tool.toolId}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{
                          backgroundColor: 'var(--ff-surface-hover)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor:
                                index === 0
                                  ? 'var(--ff-primary)'
                                  : 'var(--ff-surface)',
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: 'bold' }}>
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p
                              style={{
                                color: 'var(--ff-text-primary)',
                                fontWeight: 'var(--ff-weight-medium)',
                              }}
                            >
                              {tool.toolName}
                            </p>
                            <p
                              style={{
                                color: 'var(--ff-text-muted)',
                                fontSize: 'var(--ff-text-xs)',
                              }}
                            >
                              {tool.count} executions
                            </p>
                          </div>
                        </div>
                        <Badge
                          style={{
                            backgroundColor: 'var(--ff-primary-alpha-10)',
                            color: 'var(--ff-primary)',
                          }}
                        >
                          {tool.count}
                        </Badge>
                      </div>
                    ))}
                    {stats.mostUsedTools.length === 0 && (
                      <p
                        className="text-center py-4"
                        style={{ color: 'var(--ff-text-secondary)' }}
                      >
                        No tool usage data yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="text-center py-12"
                style={{ color: 'var(--ff-text-secondary)' }}
              >
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No statistics available yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

/**
 * Individual tool usage record card
 */
const ToolUsageCard: React.FC<{ record: ToolUsageRecord }> = ({ record }) => {
  const isSuccess = record.status === 'success';
  const timeAgo = getTimeAgo(new Date(record.createdAt));

  return (
    <div
      className="flex items-start gap-3 p-4 rounded-lg transition-all hover:scale-[1.02]"
      style={{
        backgroundColor: 'var(--ff-surface-hover)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Status Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: isSuccess
            ? 'rgba(34, 197, 94, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
        }}
      >
        {isSuccess ? (
          <CheckCircle className="w-5 h-5" style={{ color: 'var(--ff-success-500)' }} />
        ) : (
          <XCircle className="w-5 h-5" style={{ color: 'var(--ff-error-500)' }} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4
            className="font-medium truncate"
            style={{ color: 'var(--ff-text-primary)' }}
          >
            {record.toolName}
          </h4>
          <Badge
            variant={isSuccess ? 'default' : 'destructive'}
            style={{
              fontSize: 'var(--ff-text-xs)',
            }}
          >
            {record.status}
          </Badge>
        </div>

        <div
          className="flex flex-wrap items-center gap-3 text-xs"
          style={{ color: 'var(--ff-text-muted)' }}
        >
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {timeAgo}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {(record.processingTime / 1000).toFixed(2)}s
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            {record.creditsConsumed} credits
          </span>
          {record.model && (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {record.model}
            </span>
          )}
        </div>

        {record.errorMessage && (
          <p
            className="mt-2 text-xs"
            style={{
              color: 'var(--ff-error-500)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              padding: '6px 10px',
              borderRadius: '4px',
            }}
          >
            {record.errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Stat card component
 */
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: 'var(--ff-surface-hover)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div style={{ color }}>{React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}</div>
        <span
          style={{
            color: 'var(--ff-text-secondary)',
            fontSize: 'var(--ff-text-xs)',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          color: 'var(--ff-text-primary)',
          fontSize: 'var(--ff-text-2xl)',
          fontWeight: 'var(--ff-weight-bold)',
        }}
      >
        {value}
      </div>
    </div>
  );
};

/**
 * Helper function to format time ago
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
