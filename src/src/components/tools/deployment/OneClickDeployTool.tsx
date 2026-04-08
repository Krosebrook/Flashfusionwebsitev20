import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { 
  Rocket, 
  Cloud,
  Settings, 
  Monitor,
  Server,
  CheckCircle,
  Lock,
  Globe,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface DeploymentPlatform {
  id: string;
  name: string;
  type: 'static' | 'fullstack' | 'serverless' | 'container';
  icon: string;
  description: string;
  pricing: string;
  features: string[];
  buildTime: string;
  freeThreshold: string;
  regions: string[];
  supported_frameworks: string[];
  requires_credit_card: boolean;
  ssl_included: boolean;
  custom_domains: boolean;
  environment_variables: boolean;
  monitoring: boolean;
  auto_scaling: boolean;
  databases: string[];
}

interface DeploymentConfig {
  platform: string;
  project_name: string;
  repository_url: string;
  branch: string;
  build_command: string;
  output_directory: string;
  environment_variables: Record<string, string>;
  custom_domain?: string;
  ssl_enabled: boolean;
  auto_deploy: boolean;
  region: string;
  framework: string;
  node_version: string;
}

interface DeploymentStatus {
  id: string;
  status: 'pending' | 'building' | 'deploying' | 'success' | 'failed' | 'cancelled';
  progress: number;
  url?: string;
  logs: any[];
  started_at: number;
  completed_at?: number;
}

const DEPLOYMENT_PLATFORMS: DeploymentPlatform[] = [
  {
    id: 'vercel',
    name: 'Vercel',
    type: 'static',
    icon: '▲',
    description: 'Deploy frontend frameworks and static sites instantly',
    pricing: 'Free tier + $20/month pro',
    features: ['Edge Functions', 'Analytics', 'Preview Deployments', 'Git Integration'],
    buildTime: '1-3 minutes',
    freeThreshold: '100GB bandwidth',
    regions: ['Global Edge Network'],
    supported_frameworks: ['Next.js', 'React', 'Vue', 'Angular', 'Svelte', 'Nuxt'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['Vercel Postgres', 'Vercel Redis']
  },
  {
    id: 'netlify',
    name: 'Netlify',
    type: 'static',
    icon: '🌐',
    description: 'All-in-one platform for automating modern web projects',
    pricing: 'Free tier + $19/month pro',
    features: ['Form Handling', 'Identity', 'Functions', 'Split Testing'],
    buildTime: '2-5 minutes',
    freeThreshold: '100GB bandwidth',
    regions: ['Global CDN'],
    supported_frameworks: ['React', 'Vue', 'Angular', 'Gatsby', 'Hugo', 'Jekyll'],
    requires_credit_card: false,
    ssl_included: true,
    custom_domains: true,
    environment_variables: true,
    monitoring: true,
    auto_scaling: true,
    databases: ['Netlify Graph']
  },
];

export function OneClickDeployTool(): JSX.Element {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('vercel');
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    platform: 'vercel',
    project_name: '',
    repository_url: '',
    branch: 'main',
    build_command: 'npm run build',
    output_directory: 'build',
    environment_variables: {},
    ssl_enabled: true,
    auto_deploy: true,
    region: '',
    framework: 'react',
    node_version: '18'
  });
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStatus | null>(null);
  const [activeTab, setActiveTab] = useState<string>('platforms');
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  const selectedPlatformData = DEPLOYMENT_PLATFORMS.find(p => p.id === selectedPlatform);

  const handlePlatformSelect = useCallback((platformId: string): void => {
    const platform = DEPLOYMENT_PLATFORMS.find(p => p.id === platformId);
    if (platform) {
      setSelectedPlatform(platformId);
      setDeploymentConfig(prev => ({
        ...prev,
        platform: platformId,
        region: platform.regions[0]
      }));
    }
  }, []);

  const handleDeploy = useCallback(async (): Promise<void> => {
    setIsDeploying(true);
    
    const newDeployment: DeploymentStatus = {
      id: `deploy_${Date.now()}`,
      status: 'pending',
      progress: 0,
      logs: [],
      started_at: Date.now()
    };

    setDeploymentStatus(newDeployment);
    setActiveTab('monitor');

    try {
      // Simulate deployment process
      const deploymentSteps = [
        { message: 'Connecting to repository...', duration: 2000 },
        { message: 'Installing dependencies...', duration: 4000 },
        { message: 'Running build command...', duration: 3000 },
        { message: 'Finalizing deployment...', duration: 1000 }
      ];

      for (let i = 0; i < deploymentSteps.length; i++) {
        const step = deploymentSteps[i];
        
        // Update status to building
        if (i === 1) newDeployment.status = 'building';
        if (i === 3) newDeployment.status = 'deploying';

        newDeployment.logs.push({
          timestamp: Date.now(),
          level: 'info',
          message: step.message
        });

        newDeployment.progress = ((i + 1) / deploymentSteps.length) * 100;

        setDeploymentStatus({ ...newDeployment });
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }

      // Complete deployment
      newDeployment.status = 'success';
      newDeployment.progress = 100;
      newDeployment.completed_at = Date.now();
      newDeployment.url = `https://${deploymentConfig.project_name || 'project'}.vercel.app`;

      newDeployment.logs.push({
        timestamp: Date.now(),
        level: 'success',
        message: `Deployment successful! Available at ${newDeployment.url}`
      });

      setDeploymentStatus({ ...newDeployment });
      
      toast.success('Deployment completed successfully!');

    } catch (error) {
      newDeployment.status = 'failed';
      newDeployment.completed_at = Date.now();
      setDeploymentStatus({ ...newDeployment });
      toast.error('Deployment failed.');
    } finally {
      setIsDeploying(false);
    }
  }, [deploymentConfig]);

  return (
    <div className="space-y-6 ff-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--ff-primary)] to-[var(--ff-accent)]">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-['Sora'] text-2xl font-bold text-[var(--ff-text-primary)]">
              One-Click Deploy
            </h1>
            <p className="text-[var(--ff-text-secondary)] text-sm">
              Deploy to supported platforms with automated CI/CD and monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms" className="ff-nav-item">
            <Cloud className="h-4 w-4 mr-1" />
            Platforms
          </TabsTrigger>
          <TabsTrigger value="configure" className="ff-nav-item">
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="deploy" className="ff-nav-item">
            <Rocket className="h-4 w-4 mr-1" />
            Deploy
          </TabsTrigger>
          <TabsTrigger value="monitor" className="ff-nav-item">
            <Monitor className="h-4 w-4 mr-1" />
            Monitor
          </TabsTrigger>
        </TabsList>

        {/* Platform Selection Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <Card className="ff-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-[var(--ff-secondary)]" />
                Choose Deployment Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPLOYMENT_PLATFORMS.map((platform) => (
                  <Card
                    key={platform.id}
                    className={`ff-card-interactive cursor-pointer transition-all duration-200 ${
                      selectedPlatform === platform.id
                        ? 'ring-2 ring-[var(--ff-primary)] bg-gradient-to-br from-[var(--ff-primary)]/10 to-transparent'
                        : 'hover:shadow-lg hover:scale-105'
                    }`}
                    onClick={() => handlePlatformSelect(platform.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{platform.icon}</span>
                            <div>
                              <h3 className="font-['Sora'] font-semibold text-[var(--ff-text-primary)]">
                                {platform.name}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {platform.type}
                              </Badge>
                            </div>
                          </div>
                          {selectedPlatform === platform.id && (
                            <CheckCircle className="h-5 w-5 text-[var(--ff-primary)]" />
                          )}
                        </div>

                        <p className="text-sm text-[var(--ff-text-secondary)] line-clamp-2">
                          {platform.description}
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                          {platform.ssl_included && (
                            <div className="flex items-center gap-1">
                              <Lock className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600">SSL</span>
                            </div>
                          )}
                          {platform.custom_domains && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3 text-blue-500" />
                              <span className="text-xs text-blue-600">Custom Domain</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
            <Button className="w-full ff-btn-primary" size="lg" onClick={handleDeploy} disabled={isDeploying}>
                {isDeploying ? 'Deploying...' : 'Deploy Now'}
            </Button>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-6">
            {deploymentStatus ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between mb-4">
                            <h3 className="font-semibold">Deployment Status: {deploymentStatus.status}</h3>
                            <span>{Math.round(deploymentStatus.progress)}%</span>
                        </div>
                        <Progress value={deploymentStatus.progress} className="mb-4" />
                        <div className="space-y-2 bg-black/20 p-4 rounded text-sm font-mono max-h-60 overflow-auto">
                            {deploymentStatus.logs.map((log, i) => (
                                <div key={i} className={log.level === 'error' ? 'text-red-400' : 'text-gray-300'}>
                                    {log.message}
                                </div>
                            ))}
                        </div>
                        {deploymentStatus.url && (
                            <div className="mt-4">
                                <a href={deploymentStatus.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                                    View Deployment
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-12 text-muted-foreground">
                    No active deployment
                </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OneClickDeployTool;