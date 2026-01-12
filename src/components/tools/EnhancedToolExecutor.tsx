/**
 * @fileoverview Enhanced Tool Executor with Credit Tracking
 * @description Wrapper component that adds credit tracking and usage history to any tool
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { useToolExecution, useUserCredits } from '../../hooks/useToolExecution';
import { Loader2, AlertTriangle, CheckCircle, XCircle, Zap, CreditCard } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { ToolExecutionRequest } from '../../services/ToolExecutionService';

interface EnhancedToolExecutorProps {
  toolId: string;
  toolName: string;
  userId: string;
  parameters: Record<string, any>;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  children?: React.ReactNode;
}

/**
 * Enhanced Tool Executor
 * Wraps tool execution with credit checks, progress tracking, and results display
 */
export const EnhancedToolExecutor: React.FC<EnhancedToolExecutorProps> = ({
  toolId,
  toolName,
  userId,
  parameters,
  onSuccess,
  onError,
  children,
}) => {
  const { executeTool, getToolCost, isExecuting, result, error } = useToolExecution();
  const { credits, fetchCredits, hasCredits } = useUserCredits(userId);
  const [canExecute, setCanExecute] = useState(false);

  const toolCost = getToolCost(toolId);

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Check if user has sufficient credits
  useEffect(() => {
    if (credits) {
      const hasSufficientCredits =
        credits.tier === 'enterprise' || credits.available >= toolCost;
      setCanExecute(hasSufficientCredits);
    }
  }, [credits, toolCost]);

  const handleExecute = async () => {
    if (!canExecute) {
      toast.error('Insufficient credits. Please upgrade your plan.');
      return;
    }

    const request: ToolExecutionRequest = {
      toolId,
      userId,
      parameters,
    };

    const executionResult = await executeTool(request);

    if (executionResult?.success) {
      onSuccess?.(executionResult.output);
      // Refresh credits after successful execution
      fetchCredits();
    } else {
      onError?.(executionResult?.error || 'Execution failed');
    }
  };

  return (
    <div className="space-y-4">
      {/* Credit Info Banner */}
      <Card
        className="border-l-4"
        style={{
          borderLeftColor: canExecute ? 'var(--ff-primary)' : 'var(--ff-error-500)',
          backgroundColor: 'var(--ff-surface)',
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: canExecute
                    ? 'rgba(255, 123, 0, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                }}
              >
                {canExecute ? (
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--ff-primary)' }} />
                ) : (
                  <AlertTriangle className="w-5 h-5" style={{ color: 'var(--ff-error-500)' }} />
                )}
              </div>
              <div>
                <p
                  className="font-medium"
                  style={{ color: 'var(--ff-text-primary)', fontSize: 'var(--ff-text-sm)' }}
                >
                  {toolName}
                </p>
                <p
                  style={{ color: 'var(--ff-text-muted)', fontSize: 'var(--ff-text-xs)' }}
                >
                  Cost: {toolCost} credits
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" style={{ color: 'var(--ff-text-muted)' }} />
                <span
                  style={{
                    color: canExecute ? 'var(--ff-text-primary)' : 'var(--ff-error-500)',
                    fontWeight: 'var(--ff-weight-semibold)',
                  }}
                >
                  {credits?.available.toLocaleString() || '...'} available
                </span>
              </div>
              <Badge
                variant="outline"
                className="mt-1"
                style={{
                  fontSize: 'var(--ff-text-xs)',
                  color: 'var(--ff-text-secondary)',
                }}
              >
                {credits?.tier || 'free'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tool Interface */}
      {children}

      {/* Execution Controls */}
      <Card style={{ backgroundColor: 'var(--ff-surface)' }}>
        <CardContent className="p-4">
          <Button
            onClick={handleExecute}
            disabled={!canExecute || isExecuting}
            className="w-full"
            style={{
              backgroundColor: canExecute ? 'var(--ff-primary)' : 'var(--ff-surface-hover)',
              color: 'white',
              fontWeight: 'var(--ff-weight-semibold)',
            }}
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Execute Tool ({toolCost} credits)
              </>
            )}
          </Button>

          {!canExecute && credits && (
            <Alert className="mt-4" variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Insufficient credits. You need {toolCost} credits but only have{' '}
                {credits.available} available.{' '}
                <button
                  className="underline font-medium"
                  onClick={() => toast.info('Upgrade feature coming soon!')}
                >
                  Upgrade now
                </button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Execution Result */}
      {result && (
        <Card
          style={{
            backgroundColor: result.success
              ? 'rgba(34, 197, 94, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${
              result.success ? 'var(--ff-success-500)' : 'var(--ff-error-500)'
            }`,
          }}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--ff-success-500)' }} />
              ) : (
                <XCircle className="w-5 h-5" style={{ color: 'var(--ff-error-500)' }} />
              )}
              <CardTitle
                style={{
                  color: result.success ? 'var(--ff-success-500)' : 'var(--ff-error-500)',
                  fontSize: 'var(--ff-text-lg)',
                }}
              >
                {result.success ? 'Success!' : 'Execution Failed'}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-2">
                <p style={{ color: 'var(--ff-text-secondary)', fontSize: 'var(--ff-text-sm)' }}>
                  Tool executed successfully in{' '}
                  {(result.metadata.processingTime / 1000).toFixed(2)}s
                </p>
                <div className="flex gap-2 text-xs" style={{ color: 'var(--ff-text-muted)' }}>
                  <span>Credits used: {result.metadata.creditsConsumed}</span>
                  {result.metadata.model && <span>• Model: {result.metadata.model}</span>}
                  {result.metadata.provider && (
                    <span>• Provider: {result.metadata.provider}</span>
                  )}
                </div>
              </div>
            ) : (
              <p style={{ color: 'var(--ff-error-500)', fontSize: 'var(--ff-text-sm)' }}>
                {result.error || 'An unknown error occurred'}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {error && !result && (
        <Alert variant="destructive">
          <XCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

/**
 * Simple Image Generator using Enhanced Tool Executor
 */
export const SimpleImageGeneratorExample: React.FC<{ userId: string }> = ({ userId }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1
        className="text-3xl font-bold mb-6"
        style={{ color: 'var(--ff-text-primary)', fontFamily: 'var(--ff-font-primary)' }}
      >
        AI Image Generator
      </h1>

      <EnhancedToolExecutor
        toolId="ai-design-system"
        toolName="AI Image Generator"
        userId={userId}
        parameters={{ prompt }}
        onSuccess={(result) => {
          setGeneratedImage(result);
          toast.success('Image generated successfully!');
        }}
        onError={(error) => {
          toast.error(`Generation failed: ${error}`);
        }}
      >
        {/* Tool-specific UI */}
        <Card style={{ backgroundColor: 'var(--ff-surface)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--ff-text-primary)' }}>Image Prompt</CardTitle>
            <CardDescription style={{ color: 'var(--ff-text-secondary)' }}>
              Describe the image you want to generate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene sunset over mountains with a lake in the foreground..."
              className="w-full h-32 p-3 rounded-lg resize-none"
              style={{
                backgroundColor: 'var(--ff-surface-hover)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--ff-text-primary)',
              }}
            />
          </CardContent>
        </Card>
      </EnhancedToolExecutor>

      {/* Display Generated Image */}
      {generatedImage && (
        <Card className="mt-6" style={{ backgroundColor: 'var(--ff-surface)' }}>
          <CardHeader>
            <CardTitle style={{ color: 'var(--ff-text-primary)' }}>Generated Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={generatedImage.imageUrl}
                alt={generatedImage.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            <p
              className="mt-4 text-sm"
              style={{ color: 'var(--ff-text-secondary)' }}
            >
              {generatedImage.prompt}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
