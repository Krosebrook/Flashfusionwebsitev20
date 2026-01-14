import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AIService } from './AIService';
import type { AIProvider } from './AIService';

/**
 * FlashFusion Tool Execution Service
 * Handles tool execution, credit tracking, usage history, and API integrations
 * 
 * Features:
 * - Real and mock API integrations for AI tools
 * - Credit consumption tracking
 * - Usage history persistence
 * - Rate limiting and error handling
 * - Demo mode support
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ToolExecutionRequest {
  toolId: string;
  userId: string;
  parameters: Record<string, any>;
  options?: {
    model?: string;
    provider?: AIProvider;
    temperature?: number;
    maxTokens?: number;
  };
}

export interface ToolExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  metadata: {
    executionId: string;
    timestamp: string;
    processingTime: number;
    creditsConsumed: number;
    model?: string;
    provider?: string;
  };
}

export interface ToolUsageRecord {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  parameters: Record<string, any>;
  result: any;
  status: 'success' | 'failed' | 'cancelled';
  creditsConsumed: number;
  processingTime: number;
  model?: string;
  provider?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface UserCredits {
  userId: string;
  available: number;
  used: number;
  total: number;
  resetDate: string;
  tier: 'free' | 'pro' | 'enterprise';
}

// ============================================================================
// CREDIT SYSTEM CONFIGURATION
// ============================================================================

export const TOOL_CREDIT_COSTS = {
  // Generation Tools
  'next-app-generator': 50,
  'react-component-builder': 20,
  'vue-app-generator': 50,
  'svelte-app-generator': 50,
  'angular-app-generator': 60,
  'api-generator': 40,
  'graphql-generator': 45,
  'creator-content-pipeline': 100,
  'flutter-generator': 70,
  'react-native-generator': 70,
  'blockchain-generator': 150,
  
  // Design Tools
  'ai-design-system': 80,
  'logo-generator': 30,
  'color-palette-generator': 10,
  'icon-generator': 40,
  'mockup-generator': 50,
  
  // Optimization Tools
  'seo-optimizer': 25,
  'bundle-analyzer': 15,
  'image-optimizer': 10,
  'code-splitter': 20,
  'lazy-loader': 15,
  
  // Analysis Tools
  'performance-analyzer': 30,
  'accessibility-checker': 20,
  'security-scanner': 40,
  'code-quality-analyzer': 35,
  'lighthouse-runner': 25,
  
  // Automation Tools
  'deployment-automation': 50,
  'testing-automation': 45,
  'backup-automation': 30,
  'monitoring-setup': 40,
  'ai-chatbot-builder': 100,
  
  // Collaboration Tools
  'code-review-assistant': 35,
  'documentation-generator': 25,
  'changelog-generator': 10,
  'readme-generator': 15,
};

export const TIER_CREDIT_LIMITS = {
  free: 1000,
  pro: 10000,
  enterprise: -1, // Unlimited
};

// ============================================================================
// TOOL EXECUTION SERVICE
// ============================================================================

class ToolExecutionServiceClass {
  private demoMode: boolean;
  private aiService: AIService;
  private executionQueue: Map<string, ToolExecutionRequest>;

  constructor() {
    this.demoMode = !isSupabaseConfigured;
    this.aiService = new AIService();
    this.executionQueue = new Map();
  }

  // ========================================================================
  // CREDIT MANAGEMENT
  // ========================================================================

  /**
   * Get user's credit balance
   */
  async getUserCredits(userId: string): Promise<UserCredits> {
    if (this.demoMode) {
      return {
        userId,
        available: 750,
        used: 250,
        total: 1000,
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tier: 'free',
      };
    }

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user credits:', error);
        // Return default credits on error
        return this.getDefaultCredits(userId);
      }

      return {
        userId: data.user_id,
        available: data.available,
        used: data.used,
        total: data.total,
        resetDate: data.reset_date,
        tier: data.tier,
      };
    } catch (error) {
      console.error('Error in getUserCredits:', error);
      return this.getDefaultCredits(userId);
    }
  }

  /**
   * Check if user has sufficient credits
   */
  async hasCredits(userId: string, requiredCredits: number): Promise<boolean> {
    const credits = await this.getUserCredits(userId);
    return credits.tier === 'enterprise' || credits.available >= requiredCredits;
  }

  /**
   * Deduct credits from user balance
   */
  async consumeCredits(userId: string, amount: number): Promise<boolean> {
    if (this.demoMode) {
      console.log(`[Demo Mode] Would consume ${amount} credits for user ${userId}`);
      return true;
    }

    try {
      const { error } = await supabase.rpc('consume_credits', {
        p_user_id: userId,
        p_amount: amount,
      });

      if (error) {
        console.error('Error consuming credits:', error);
        toast.error('Failed to process credits');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in consumeCredits:', error);
      return false;
    }
  }

  /**
   * Get credit cost for a specific tool
   */
  getToolCost(toolId: string): number {
    return TOOL_CREDIT_COSTS[toolId] || 20; // Default cost
  }

  // ========================================================================
  // TOOL EXECUTION
  // ========================================================================

  /**
   * Execute a tool with credit tracking
   */
  async executeTool(request: ToolExecutionRequest): Promise<ToolExecutionResult> {
    const startTime = Date.now();
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    try {
      // Check credit cost
      const creditCost = this.getToolCost(request.toolId);
      const hasCredits = await this.hasCredits(request.userId, creditCost);

      if (!hasCredits) {
        toast.error('Insufficient credits. Please upgrade your plan.');
        return {
          success: false,
          error: 'Insufficient credits',
          metadata: {
            executionId,
            timestamp: new Date().toISOString(),
            processingTime: Date.now() - startTime,
            creditsConsumed: 0,
          },
        };
      }

      // Execute the tool
      const output = await this.executeToolImplementation(request);

      // Consume credits on success
      await this.consumeCredits(request.userId, creditCost);

      // Record usage
      await this.recordUsage({
        id: executionId,
        userId: request.userId,
        toolId: request.toolId,
        toolName: this.getToolName(request.toolId),
        parameters: request.parameters,
        result: output,
        status: 'success',
        creditsConsumed: creditCost,
        processingTime: Date.now() - startTime,
        model: request.options?.model,
        provider: request.options?.provider,
        createdAt: new Date().toISOString(),
      });

      toast.success('Tool executed successfully');

      return {
        success: true,
        output,
        metadata: {
          executionId,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime,
          creditsConsumed: creditCost,
          model: request.options?.model,
          provider: request.options?.provider,
        },
      };
    } catch (error) {
      console.error('Tool execution error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Record failed execution
      await this.recordUsage({
        id: executionId,
        userId: request.userId,
        toolId: request.toolId,
        toolName: this.getToolName(request.toolId),
        parameters: request.parameters,
        result: null,
        status: 'failed',
        creditsConsumed: 0, // Don't consume credits on failure
        processingTime: Date.now() - startTime,
        errorMessage,
        createdAt: new Date().toISOString(),
      });

      toast.error(`Tool execution failed: ${errorMessage}`);

      return {
        success: false,
        error: errorMessage,
        metadata: {
          executionId,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime,
          creditsConsumed: 0,
        },
      };
    }
  }

  /**
   * Execute tool implementation (real or mock)
   */
  private async executeToolImplementation(request: ToolExecutionRequest): Promise<any> {
    // Route to appropriate tool implementation
    switch (request.toolId) {
      case 'next-app-generator':
      case 'react-component-builder':
      case 'vue-app-generator':
      case 'api-generator':
        return this.executeCodeGeneration(request);

      case 'ai-design-system':
      case 'logo-generator':
      case 'icon-generator':
        return this.executeImageGeneration(request);

      case 'seo-optimizer':
      case 'accessibility-checker':
      case 'performance-analyzer':
        return this.executeAnalysis(request);

      default:
        // Generic AI completion for other tools
        return this.executeGenericAI(request);
    }
  }

  /**
   * Execute code generation tools
   */
  private async executeCodeGeneration(request: ToolExecutionRequest): Promise<any> {
    const prompt = this.buildCodeGenerationPrompt(request);
    
    if (this.demoMode) {
      // Return mock code for demo
      return {
        code: this.generateMockCode(request),
        language: request.parameters.language || 'typescript',
        framework: request.parameters.framework || 'react',
        files: this.generateMockFiles(request),
      };
    }

    // Real AI code generation
    const result = await this.aiService.generateCode({
      type: 'component',
      framework: request.parameters.framework || 'react',
      requirements: prompt,
      options: {
        includeTests: request.parameters.includeTests || false,
        includeDocumentation: true,
        includeTypeScript: true,
      },
    });

    return result;
  }

  /**
   * Execute image generation tools
   */
  private async executeImageGeneration(request: ToolExecutionRequest): Promise<any> {
    if (this.demoMode) {
      // Return mock image data
      return {
        imageUrl: 'https://picsum.photos/512/512',
        prompt: request.parameters.prompt || 'Generated image',
        dimensions: { width: 512, height: 512 },
        format: 'png',
      };
    }

    // Real image generation would call appropriate API
    const result = await this.aiService.generateImage({
      prompt: request.parameters.prompt,
      model: request.options?.model || 'dall-e-3',
      size: request.parameters.size || '1024x1024',
      quality: request.parameters.quality || 'standard',
    });

    return result;
  }

  /**
   * Execute analysis tools
   */
  private async executeAnalysis(request: ToolExecutionRequest): Promise<any> {
    if (this.demoMode) {
      return this.generateMockAnalysis(request);
    }

    // Real analysis using AI
    const result = await this.aiService.analyze({
      type: request.toolId.replace('-', '_'),
      content: request.parameters.content || request.parameters.url,
      options: request.parameters,
    });

    return result;
  }

  /**
   * Execute generic AI tools
   */
  private async executeGenericAI(request: ToolExecutionRequest): Promise<any> {
    if (this.demoMode) {
      return {
        result: `Mock result for ${request.toolId}`,
        parameters: request.parameters,
      };
    }

    const result = await this.aiService.complete({
      prompt: request.parameters.prompt || JSON.stringify(request.parameters),
      model: request.options?.model || 'gpt-4-turbo',
      provider: request.options?.provider || 'openai',
      temperature: request.options?.temperature || 0.7,
    });

    return result;
  }

  // ========================================================================
  // USAGE HISTORY
  // ========================================================================

  /**
   * Record tool usage in history
   */
  private async recordUsage(record: ToolUsageRecord): Promise<void> {
    if (this.demoMode) {
      console.log('[Demo Mode] Tool usage recorded:', record);
      return;
    }

    try {
      const { error } = await supabase.from('tool_usage_history').insert({
        id: record.id,
        user_id: record.userId,
        tool_id: record.toolId,
        tool_name: record.toolName,
        parameters: record.parameters,
        result: record.result,
        status: record.status,
        credits_consumed: record.creditsConsumed,
        processing_time: record.processingTime,
        model: record.model,
        provider: record.provider,
        error_message: record.errorMessage,
        created_at: record.createdAt,
      });

      if (error) {
        console.error('Error recording usage:', error);
      }
    } catch (error) {
      console.error('Error in recordUsage:', error);
    }
  }

  /**
   * Get user's tool usage history
   */
  async getUserHistory(userId: string, limit: number = 50): Promise<ToolUsageRecord[]> {
    if (this.demoMode) {
      return this.generateMockHistory(userId);
    }

    try {
      const { data, error } = await supabase
        .from('tool_usage_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching history:', error);
        return [];
      }

      return data.map(record => ({
        id: record.id,
        userId: record.user_id,
        toolId: record.tool_id,
        toolName: record.tool_name,
        parameters: record.parameters,
        result: record.result,
        status: record.status,
        creditsConsumed: record.credits_consumed,
        processingTime: record.processing_time,
        model: record.model,
        provider: record.provider,
        errorMessage: record.error_message,
        createdAt: record.created_at,
      }));
    } catch (error) {
      console.error('Error in getUserHistory:', error);
      return [];
    }
  }

  /**
   * Get usage statistics for a user
   */
  async getUserStats(userId: string): Promise<{
    totalExecutions: number;
    successRate: number;
    totalCreditsUsed: number;
    mostUsedTools: Array<{ toolId: string; toolName: string; count: number }>;
    averageProcessingTime: number;
  }> {
    const history = await this.getUserHistory(userId, 1000);

    const totalExecutions = history.length;
    const successful = history.filter(h => h.status === 'success').length;
    const totalCreditsUsed = history.reduce((sum, h) => sum + h.creditsConsumed, 0);

    // Count tool usage
    const toolCounts = new Map<string, { toolId: string; toolName: string; count: number }>();
    history.forEach(h => {
      const existing = toolCounts.get(h.toolId);
      if (existing) {
        existing.count++;
      } else {
        toolCounts.set(h.toolId, { toolId: h.toolId, toolName: h.toolName, count: 1 });
      }
    });

    const mostUsedTools = Array.from(toolCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averageProcessingTime =
      history.length > 0
        ? history.reduce((sum, h) => sum + h.processingTime, 0) / history.length
        : 0;

    return {
      totalExecutions,
      successRate: totalExecutions > 0 ? (successful / totalExecutions) * 100 : 0,
      totalCreditsUsed,
      mostUsedTools,
      averageProcessingTime,
    };
  }

  // ========================================================================
  // HELPER METHODS
  // ========================================================================

  private getDefaultCredits(userId: string): UserCredits {
    return {
      userId,
      available: 1000,
      used: 0,
      total: 1000,
      resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      tier: 'free',
    };
  }

  private getToolName(toolId: string): string {
    const names: Record<string, string> = {
      'next-app-generator': 'Next.js App Generator',
      'react-component-builder': 'React Component Builder',
      'ai-design-system': 'AI Design System',
      'seo-optimizer': 'SEO Optimizer',
      'performance-analyzer': 'Performance Analyzer',
      // Add more mappings as needed
    };
    return names[toolId] || toolId;
  }

  private buildCodeGenerationPrompt(request: ToolExecutionRequest): string {
    const { description, framework, features } = request.parameters;
    return `Generate a ${framework} application with the following:
Description: ${description}
Features: ${features?.join(', ') || 'basic functionality'}
Requirements: ${request.parameters.requirements || 'follow best practices'}`;
  }

  private generateMockCode(request: ToolExecutionRequest): string {
    const framework = request.parameters.framework || 'react';
    return `// ${framework} Component - Generated by FlashFusion
import React from 'react';

export const GeneratedComponent = () => {
  return (
    <div className="container">
      <h1>Generated ${framework} Component</h1>
      <p>This is a mock implementation for demo purposes.</p>
    </div>
  );
};

export default GeneratedComponent;`;
  }

  private generateMockFiles(request: ToolExecutionRequest): Array<{ path: string; content: string }> {
    return [
      { path: 'src/App.tsx', content: this.generateMockCode(request) },
      { path: 'src/index.tsx', content: '// Entry point\nimport App from "./App";\n' },
      { path: 'package.json', content: '{\n  "name": "generated-app",\n  "version": "1.0.0"\n}' },
    ];
  }

  private generateMockAnalysis(request: ToolExecutionRequest): any {
    return {
      score: 85,
      issues: [
        { severity: 'warning', message: 'Consider improving accessibility', line: 42 },
        { severity: 'info', message: 'Performance could be optimized', line: 67 },
      ],
      recommendations: [
        'Add alt text to images',
        'Implement lazy loading for images',
        'Minify and compress assets',
      ],
      metrics: {
        performance: 88,
        accessibility: 92,
        bestPractices: 85,
        seo: 78,
      },
    };
  }

  private generateMockHistory(userId: string): ToolUsageRecord[] {
    return [
      {
        id: 'mock_1',
        userId,
        toolId: 'next-app-generator',
        toolName: 'Next.js App Generator',
        parameters: { framework: 'nextjs', description: 'E-commerce site' },
        result: { success: true },
        status: 'success',
        creditsConsumed: 50,
        processingTime: 3500,
        model: 'gpt-4-turbo',
        provider: 'openai',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'mock_2',
        userId,
        toolId: 'seo-optimizer',
        toolName: 'SEO Optimizer',
        parameters: { url: 'https://example.com' },
        result: { score: 85 },
        status: 'success',
        creditsConsumed: 25,
        processingTime: 2000,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ];
  }
}

// Export singleton instance
export const ToolExecutionService = new ToolExecutionServiceClass();
