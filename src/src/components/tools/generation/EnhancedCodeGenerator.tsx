import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Separator } from '../../ui/separator';
import { 
  Sparkles, 
  Code, 
  Download, 
  GitBranch,
  Brain,
  Zap,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Settings
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import AIService, { type CodeGenerationRequest } from '../../../services/AIService';

interface GenerationOptions {
  codeType: 'component' | 'page' | 'api' | 'full-stack' | 'config' | 'test';
  framework: string;
  includeTests: boolean;
  includeDocumentation: boolean;
  includeTypeScript: boolean;
  optimizeForPerformance: boolean;
  followRepositoryPatterns: boolean;
  generateMultipleVariants: boolean;
  enhanceWithAI: boolean;
}

interface GeneratedCode {
  main: string;
  tests?: string;
  documentation?: string;
  metadata: {
    aiModel: string;
    generationTime: number;
    complexity: 'low' | 'medium' | 'high';
    suggestions: string[];
  };
}

const FRAMEWORKS = [
  { id: 'react', name: 'React', icon: '⚛️' },
  { id: 'nextjs', name: 'Next.js', icon: '▲' },
  { id: 'nodejs', name: 'Node.js', icon: '🟢' },
  { id: 'python', name: 'Python', icon: '🐍' },
];

const CODE_TYPES = [
  { id: 'component', name: 'Component', icon: '⚛️', description: 'Reusable UI components' },
  { id: 'page', name: 'Page/Route', icon: '📄', description: 'Complete page implementations' },
  { id: 'api', name: 'API Endpoint', icon: '🌐', description: 'Backend API endpoints' },
  { id: 'full-stack', name: 'Full Stack', icon: '🏗️', description: 'Complete feature implementation' },
  { id: 'test', name: 'Test Suite', icon: '🧪', description: 'Comprehensive test cases' },
];

export function EnhancedCodeGenerator() {
  const [requirements, setRequirements] = useState('');
  const [options, setOptions] = useState<GenerationOptions>({
    codeType: 'component',
    framework: 'react',
    includeTests: true,
    includeDocumentation: true,
    includeTypeScript: true,
    optimizeForPerformance: true,
    followRepositoryPatterns: false,
    generateMultipleVariants: false,
    enhanceWithAI: true
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [activeTab, setActiveTab] = useState('configure');

  const handleOptionChange = useCallback((key: keyof GenerationOptions, value: any) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const generateCode = useCallback(async () => {
    if (!requirements.trim()) {
      toast.error('Please provide requirements for code generation');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      const startTime = Date.now();
      
      // Update progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 85) return prev + Math.random() * 10;
          return prev;
        });
      }, 500);

      toast.info('Starting enhanced AI code generation...');

      // Build generation request
      const generationRequest: CodeGenerationRequest = {
        type: options.codeType,
        framework: options.framework,
        requirements,
        context: {
          styleGuide: 'Use FlashFusion design system with brand colors and animations',
        },
        options: {
          includeTests: options.includeTests,
          includeDocumentation: options.includeDocumentation,
          includeTypeScript: options.includeTypeScript,
          optimizeForPerformance: options.optimizeForPerformance,
        }
      };

      // Generate main code
      const mainCode = await AIService.generateCode(generationRequest);

      clearInterval(progressInterval);
      setGenerationProgress(90);

      const result: GeneratedCode = {
        main: mainCode,
        metadata: {
          aiModel: AIService.getCurrentModel()?.name || 'Unknown',
          generationTime: Date.now() - startTime,
          complexity: 'medium', // mock
          suggestions: []
        }
      };

      // Generate tests if requested
      if (options.includeTests) {
        result.tests = await AIService.generateCode({
          type: 'test',
          framework: options.framework,
          requirements: `Generate comprehensive tests for: ${requirements}`,
          context: { existingCode: mainCode },
          options: { includeTypeScript: options.includeTypeScript }
        });
      }

      // Generate documentation if requested
      if (options.includeDocumentation) {
        result.documentation = await AIService.generateDocumentation(
          mainCode,
          options.codeType as any
        );
      }

      setGenerationProgress(100);
      setGeneratedCode(result);
      setActiveTab('results');

      toast.success('🎉 Enhanced code generation complete!');
    } catch (error) {
      console.error('Code generation failed:', error);
      toast.error(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(0), 1000);
    }
  }, [requirements, options]);

  const copyToClipboard = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Code copied to clipboard!');
  }, []);

  const downloadCode = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded successfully!');
  }, []);

  const currentModel = AIService.getCurrentModel();

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="configure" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!generatedCode} className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          {/* AI Model Status */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-ff-primary" />
                AI Model Status
                {currentModel && (
                  <Badge className="ff-btn-primary ml-auto">
                    {currentModel.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentModel ? (
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-ff-success" />
                  <span className="text-ff-text-primary">
                    Ready for enhanced code generation
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <AlertCircle className="w-5 h-5 text-ff-warning" />
                  <span className="text-ff-text-secondary">
                    Please configure an AI model first
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generation Configuration */}
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-ff-accent" />
                Generation Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-medium">
                  What do you want to build? *
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe the component, feature, or functionality you want to generate..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-[100px] ff-focus-ring"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Code Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Code Type</Label>
                  <Select
                    value={options.codeType}
                    onValueChange={(value) => handleOptionChange('codeType', value)}
                  >
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CODE_TYPES.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Framework */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Framework</Label>
                  <Select
                    value={options.framework}
                    onValueChange={(value) => handleOptionChange('framework', value)}
                  >
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FRAMEWORKS.map(framework => (
                        <SelectItem key={framework.id} value={framework.id}>
                          <div className="flex items-center gap-2">
                            <span>{framework.icon}</span>
                            <span>{framework.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Options */}
              <div className="space-y-4">
                <h4 className="font-medium text-ff-text-primary">Generation Options</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeTests" className="text-sm">Include Tests</Label>
                    <Switch
                      id="includeTests"
                      checked={options.includeTests}
                      onCheckedChange={(checked) => handleOptionChange('includeTests', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeDocs" className="text-sm">Include Documentation</Label>
                    <Switch
                      id="includeDocs"
                      checked={options.includeDocumentation}
                      onCheckedChange={(checked) => handleOptionChange('includeDocumentation', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeTS" className="text-sm">TypeScript Support</Label>
                    <Switch
                      id="includeTS"
                      checked={options.includeTypeScript}
                      onCheckedChange={(checked) => handleOptionChange('includeTypeScript', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="optimizePerf" className="text-sm">Optimize Performance</Label>
                    <Switch
                      id="optimizePerf"
                      checked={options.optimizeForPerformance}
                      onCheckedChange={(checked) => handleOptionChange('optimizeForPerformance', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Button */}
          <div className="flex flex-col space-y-4">
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Generating enhanced code...</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="w-full ff-progress-bar" />
              </div>
            )}
            
            <Button
              onClick={generateCode}
              disabled={isGenerating || !requirements.trim() || !currentModel}
              className="w-full ff-btn-primary ff-hover-glow"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Enhanced Code
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {generatedCode && (
            <div className="space-y-6">
              {/* Generation Summary */}
              <Card className="ff-card-interactive">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-ff-success" />
                    Generation Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-ff-primary">
                        {generatedCode.metadata.aiModel}
                      </div>
                      <div className="text-xs text-ff-text-muted">AI Model</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-ff-secondary">
                        {Math.round(generatedCode.metadata.generationTime / 1000)}s
                      </div>
                      <div className="text-xs text-ff-text-muted">Generation Time</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-ff-accent">
                        {generatedCode.main.split('\n').length}
                      </div>
                      <div className="text-xs text-ff-text-muted">Lines of Code</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Generated Code Tabs */}
              <Tabs defaultValue="main" className="w-full">
                <TabsList className="grid w-full grid-cols-auto">
                  <TabsTrigger value="main">Main Code</TabsTrigger>
                  {generatedCode.tests && <TabsTrigger value="tests">Tests</TabsTrigger>}
                  {generatedCode.documentation && <TabsTrigger value="docs">Documentation</TabsTrigger>}
                </TabsList>

                <TabsContent value="main" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-ff-text-primary">Generated Code</h3>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generatedCode.main)}
                        className="ff-focus-ring"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(generatedCode.main, `${options.codeType}.${options.includeTypeScript ? 'tsx' : 'jsx'}`)}
                        className="ff-focus-ring"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-ff-surface rounded-lg p-4 overflow-auto max-h-96">
                    <pre className="text-sm text-ff-text-primary">
                      <code>{generatedCode.main}</code>
                    </pre>
                  </div>
                </TabsContent>

                {generatedCode.tests && (
                  <TabsContent value="tests" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-ff-text-primary">Test Suite</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(generatedCode.tests!)}
                          className="ff-focus-ring"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadCode(generatedCode.tests!, `${options.codeType}.test.${options.includeTypeScript ? 'ts' : 'js'}`)}
                          className="ff-focus-ring"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-ff-surface rounded-lg p-4 overflow-auto max-h-96">
                      <pre className="text-sm text-ff-text-primary">
                        <code>{generatedCode.tests}</code>
                      </pre>
                    </div>
                  </TabsContent>
                )}

                {generatedCode.documentation && (
                  <TabsContent value="docs" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-ff-text-primary">Documentation</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCode(generatedCode.documentation!, 'README.md')}
                        className="ff-focus-ring"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    
                    <div className="bg-ff-surface rounded-lg p-4 overflow-auto max-h-96">
                      <pre className="text-sm text-ff-text-primary whitespace-pre-wrap">
                        {generatedCode.documentation}
                      </pre>
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EnhancedCodeGenerator;