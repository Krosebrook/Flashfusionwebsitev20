import React, { useState, Suspense, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  Code, 
  FileText, 
  Rocket, 
  TrendingUp,
  Search, 
  Filter,
  Wand2,
  Loader2,
  LayoutDashboard
} from 'lucide-react';

// Lazy load core tools
const EnhancedCodeGenerator = React.lazy(() => import('./generation/EnhancedCodeGenerator'));
const ContentGeneratorTool = React.lazy(() => import('./ContentGeneratorTool'));
const OneClickDeployTool = React.lazy(() => import('./deployment/OneClickDeployTool'));
const ProjectsPage = React.lazy(() => import('../pages/ProjectsPage'));
const AnalyticsPage = React.lazy(() => import('../pages/AnalyticsPage'));

// Loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center py-12">
    <div className="flex items-center gap-3">
      <Loader2 className="w-6 h-6 animate-spin text-[var(--ff-primary)]" />
      <span className="text-[var(--ff-text-primary)]">Loading tool...</span>
    </div>
  </div>
);

interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'generation' | 'deployment' | 'analytics' | 'management';
  icon: React.ReactNode;
  component: React.ComponentType;
  featured?: boolean;
  popularity: number;
  tags: string[];
}

const TOOLS: Tool[] = [
  {
    id: 'code-generator',
    name: 'AI Code Generator',
    description: 'Generate production-ready code with advanced AI models',
    category: 'generation',
    icon: <Code className="w-5 h-5" />,
    component: EnhancedCodeGenerator,
    featured: true,
    popularity: 98,
    tags: ['code', 'ai', 'react', 'fullstack']
  },
  {
    id: 'project-manager',
    name: 'Project Manager',
    description: 'Manage your projects, resources, and timelines',
    category: 'management',
    icon: <LayoutDashboard className="w-5 h-5" />,
    component: ProjectsPage,
    featured: true,
    popularity: 95,
    tags: ['projects', 'management', 'planning']
  },
  {
    id: 'deployment-assistant',
    name: 'Deployment Assistant',
    description: 'One-click deployment to Vercel, Netlify, and more',
    category: 'deployment',
    icon: <Rocket className="w-5 h-5" />,
    component: OneClickDeployTool,
    featured: true,
    popularity: 92,
    tags: ['deployment', 'cicd', 'production']
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Track real-time user metrics and performance',
    category: 'analytics',
    icon: <TrendingUp className="w-5 h-5" />,
    component: AnalyticsPage,
    popularity: 89,
    tags: ['analytics', 'metrics', 'insights']
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Create marketing content and copy with AI',
    category: 'generation',
    icon: <FileText className="w-5 h-5" />,
    component: ContentGeneratorTool,
    popularity: 85,
    tags: ['content', 'marketing', 'copy']
  }
];

export function AIToolsHub() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Filter tools
  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(TOOLS.map(tool => tool.category)));

  const handleToolSelect = useCallback((toolId: string) => {
    setSelectedTool(toolId);
  }, []);

  const selectedToolData = selectedTool ? TOOLS.find(tool => tool.id === selectedTool) : null;

  if (selectedTool && selectedToolData) {
    const ToolComponent = selectedToolData.component;
    return (
      <div className="space-y-4" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => setSelectedTool(null)}
            variant="outline" 
            className="border-[var(--border)]"
          >
            ← Back to Tools
          </Button>
          <div className="flex items-center gap-2">
            {selectedToolData.icon}
            <h2 className="text-xl font-semibold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
              {selectedToolData.name}
            </h2>
          </div>
        </div>
        
        <Suspense fallback={<LoadingComponent />}>
          <ToolComponent />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ fontFamily: 'var(--ff-font-secondary)' }}>
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-[var(--ff-text-primary)]" style={{ fontFamily: 'var(--ff-font-primary)' }}>
            Core Tools
          </h1>
          <p className="text-xl text-[var(--ff-text-secondary)] max-w-3xl mx-auto">
            Essential tools for your development workflow. Optimized for performance and usability.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--ff-text-muted)] h-5 w-5" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-[var(--input-background)] border-[var(--border)] text-[var(--ff-text-primary)]"
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 bg-[var(--input-background)] border-[var(--border)] rounded-md text-[var(--ff-text-primary)]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option value={category} key={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card 
            key={tool.id} 
            className="bg-[var(--ff-surface)] border-[var(--border)] hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => handleToolSelect(tool.id)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[var(--ff-primary)]/10 rounded-lg group-hover:bg-[var(--ff-primary)]/20 transition-colors">
                      {tool.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--ff-text-primary)]">{tool.name}</h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {tool.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-[var(--ff-text-secondary)] line-clamp-2">{tool.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {tool.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full bg-[var(--ff-primary)] hover:bg-[var(--ff-primary-600)] text-white mt-4"
                >
                  <Wand2 className="w-3 h-3 mr-1" />
                  Open Tool
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AIToolsHub;