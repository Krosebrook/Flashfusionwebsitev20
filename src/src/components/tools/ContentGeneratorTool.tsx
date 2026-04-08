import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { 
  PenTool, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Target,
  TrendingUp,
} from 'lucide-react';
import { aiServiceManager } from '../../../services/AIServiceManager';

interface ContentConfig {
  topic: string;
  contentType: string;
  platform: string[];
  tone: string;
  audience: string;
  length: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
  includeCTA: boolean;
  keywords: string[];
  targetLanguage: string;
  brandVoice?: string;
}

interface GeneratedContent {
  id: string;
  platform: string;
  content: string;
  hashtags: string[];
  engagement_prediction: number;
  character_count: number;
  word_count: number;
  readability_score: number;
  seo_score: number;
  timestamp: number;
}

interface ContentAnalytics {
  sentiment: 'positive' | 'neutral' | 'negative';
  readability: number;
  engagement_potential: number;
  brand_alignment: number;
  trending_topics: string[];
  optimal_posting_time: string;
}

const CONTENT_TYPES = [
  { value: 'social-post', label: 'Social Media Post', description: 'Engaging social content' },
  { value: 'blog-article', label: 'Blog Article', description: 'Long-form blog content' },
  { value: 'product-description', label: 'Product Description', description: 'E-commerce product copy' },
  { value: 'email-campaign', label: 'Email Campaign', description: 'Email marketing content' },
];

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X', icon: '𝕏', limit: 280 },
  { value: 'instagram', label: 'Instagram', icon: '📸', limit: 2200 },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼', limit: 3000 },
  { value: 'blog', label: 'Blog', icon: '📝', limit: null },
  { value: 'email', label: 'Email', icon: '✉️', limit: 200 }
];

const TONES = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and friendly' },
  { value: 'humorous', label: 'Humorous', description: 'Light-hearted and funny' },
  { value: 'inspirational', label: 'Inspirational', description: 'Motivating and uplifting' },
  { value: 'educational', label: 'Educational', description: 'Informative and teaching' },
];

const AUDIENCES = [
  { value: 'general', label: 'General Audience', description: 'Broad appeal' },
  { value: 'millennials', label: 'Millennials', description: '25-40 years old' },
  { value: 'professionals', label: 'Professionals', description: 'Business audience' },
  { value: 'entrepreneurs', label: 'Entrepreneurs', description: 'Business owners' },
  { value: 'tech-enthusiasts', label: 'Tech Enthusiasts', description: 'Technology interested' },
];

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

export function ContentGeneratorTool() {
  const [config, setConfig] = useState<ContentConfig>({
    topic: '',
    contentType: 'social-post',
    platform: ['twitter'],
    tone: 'professional',
    audience: 'general',
    length: 'medium',
    includeHashtags: true,
    includeEmojis: false,
    includeCTA: true,
    keywords: [],
    targetLanguage: 'en'
  });

  const [keywordInput, setKeywordInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);

  const addKeyword = () => {
    if (keywordInput.trim() && !config.keywords.includes(keywordInput.trim())) {
      setConfig(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setConfig(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const generateContent = async () => {
    if (!config.topic.trim()) {
      alert('Please provide a topic for content generation');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent([]);
    setSelectedContent(null);
    setGenerationProgress(0);

    try {
      const contents: GeneratedContent[] = [];
      
      for (let i = 0; i < config.platform.length; i++) {
        const platform = config.platform[i];
        const platformData = PLATFORMS.find(p => p.value === platform);
        
        setGenerationProgress((i / config.platform.length) * 100);

        const prompt = buildContentPrompt(config, platform, platformData);
        const response = await aiServiceManager.generateContent({ prompt }, 'openai');

        const content = parseContentResponse(response.content, platform);
        
        // Mock analytics for now
        const analytics = {
            engagement_potential: 85,
            readability: 90
        };

        contents.push({
          ...content,
          id: `content_${Date.now()}_${i}`,
          platform,
          engagement_prediction: analytics.engagement_potential,
          readability_score: analytics.readability,
          seo_score: 80,
          timestamp: Date.now()
        } as GeneratedContent);

        // Simulate progress
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setGeneratedContent(contents);
      setSelectedContent(contents[0]);
      setGenerationProgress(100);

    } catch (error) {
      console.error('Content generation failed:', error);
      alert('Content generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const buildContentPrompt = (config: ContentConfig, platform: string, platformData: any): string => {
    const platformLimit = platformData?.limit ? ` (max ${platformData.limit} characters)` : '';
    
    return `Create ${config.contentType} content for ${platform}${platformLimit}.

Topic: ${config.topic}
Tone: ${config.tone}
Target Audience: ${config.audience}
Language: ${config.targetLanguage}
Length: ${config.length}

Requirements:
- ${config.includeHashtags ? 'Include relevant hashtags' : 'No hashtags'}
- ${config.includeEmojis ? 'Include appropriate emojis' : 'No emojis'}
- ${config.includeCTA ? 'Include a clear call-to-action' : 'No call-to-action'}
${config.keywords.length > 0 ? `- Include these keywords naturally: ${config.keywords.join(', ')}` : ''}
${config.brandVoice ? `- Brand voice: ${config.brandVoice}` : ''}

Create engaging, platform-optimized content that resonates with the target audience and drives engagement.`;
  };

  const parseContentResponse = (content: string, platform: string): Partial<GeneratedContent> => {
    // Extract hashtags
    const hashtagRegex = /#\w+/g;
    const hashtags = content.match(hashtagRegex) || [];
    
    // Remove hashtags from main content for cleaner parsing
    const mainContent = content.replace(hashtagRegex, '').trim();
    
    return {
      content: mainContent,
      hashtags: hashtags.map(h => h.slice(1)), // Remove # symbol
      character_count: content.length,
      word_count: content.split(/\s+/).filter(word => word.length > 0).length
    };
  };

  const downloadContent = () => {
    const allContent = generatedContent.map(content => 
      `=== ${content.platform.toUpperCase()} ===\n${content.content}\n\nHashtags: ${content.hashtags.map(h => '#' + h).join(' ')}\n\n`
    ).join('\n');
    
    const blob = new Blob([allContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `content-${config.topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold ff-text-gradient">
            AI Content Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create engaging, platform-optimized content with AI. From social posts to long-form articles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="ff-card-interactive sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-primary" />
                  Content Configuration
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Topic */}
                <div>
                  <Label htmlFor="topic">Content Topic</Label>
                  <Textarea
                    id="topic"
                    value={config.topic}
                    onChange={(e) => setConfig(prev => ({ ...prev, topic: e.target.value }))}
                    placeholder="Describe what you want to create content about..."
                    className="ff-focus-ring"
                    rows={3}
                  />
                </div>

                {/* Content Type */}
                <div>
                  <Label>Content Type</Label>
                  <Select value={config.contentType} onValueChange={(value) => setConfig(prev => ({ ...prev, contentType: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Platforms */}
                <div>
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {PLATFORMS.map((platform) => (
                      <div key={platform.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={platform.value}
                          checked={config.platform.includes(platform.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setConfig(prev => ({ ...prev, platform: [...prev.platform, platform.value] }));
                            } else {
                              setConfig(prev => ({ ...prev, platform: prev.platform.filter(p => p !== platform.value) }));
                            }
                          }}
                          className="ff-focus-ring"
                        />
                        <Label htmlFor={platform.value} className="text-sm flex items-center gap-1">
                          <span>{platform.icon}</span>
                          {platform.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tone */}
                <div>
                  <Label>Tone & Style</Label>
                  <Select value={config.tone} onValueChange={(value) => setConfig(prev => ({ ...prev, tone: value }))}>
                    <SelectTrigger className="ff-focus-ring">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONES.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          <div>
                            <div className="font-medium">{tone.label}</div>
                            <div className="text-xs text-muted-foreground">{tone.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Keywords */}
                <div>
                  <Label>Target Keywords</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add keyword"
                        className="ff-focus-ring"
                        onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                      />
                      <Button onClick={addKeyword} size="sm" variant="outline">
                        Add
                      </Button>
                    </div>
                    
                    {config.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {config.keywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => removeKeyword(keyword)}
                          >
                            {keyword} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateContent}
                  disabled={isGenerating || !config.topic.trim() || config.platform.length === 0}
                  className="w-full ff-btn-primary"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(generationProgress)}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {generatedContent.length > 0 ? (
              <div className="space-y-6">
                {/* Content Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Generated Content
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {generatedContent.length} platforms
                        </Badge>
                        <Button onClick={downloadContent} size="sm" className="ff-btn-secondary">
                          <Download className="w-4 h-4 mr-1" />
                          Download All
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {generatedContent.map((content) => {
                        const platform = PLATFORMS.find(p => p.value === content.platform);
                        return (
                          <Card
                            key={content.id}
                            className={`cursor-pointer transition-all duration-300 ${
                              selectedContent?.id === content.id 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : 'hover:border-primary/40'
                            }`}
                            onClick={() => setSelectedContent(content)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{platform?.icon}</span>
                                  <span className="font-medium text-sm">{platform?.label}</span>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-3">
                                {content.content}
                              </p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Content Detail */}
                {selectedContent && (
                  <Card className="ff-card-interactive">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <PenTool className="w-5 h-5 text-primary" />
                          Content Editor
                        </CardTitle>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => {
                             navigator.clipboard.writeText(selectedContent.content);
                             alert('Copied!');
                          }}>
                            Copy
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        value={selectedContent.content}
                        onChange={(e) => {
                          const newContent = e.target.value;
                          setSelectedContent({ ...selectedContent, content: newContent });
                          setGeneratedContent(prev => 
                            prev.map(c => c.id === selectedContent.id ? { ...c, content: newContent } : c)
                          );
                        }}
                        className="min-h-[200px] ff-focus-ring font-mono text-sm"
                      />
                      
                      <div className="flex flex-wrap gap-2">
                        {selectedContent.hashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary">#{tag}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Engagement: {selectedContent.engagement_prediction}%</span>
                        </div>
                        <div>
                          {selectedContent.character_count} chars
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-border rounded-lg p-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Create?</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      Configure your content preferences on the left and click "Generate" to start creating amazing content.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentGeneratorTool;