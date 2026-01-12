import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Layers, 
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Agent } from '../../types/multi-agent-orchestration';
import { 
  getTotalProjectProgress, 
  getActiveAgentsCount, 
} from '../../utils/multi-project-orchestrator';
import { useMultiProjectOrchestrator } from '../../hooks/useMultiProjectOrchestrator';

// Modular View Components
import { PortfolioView } from './multi-project/PortfolioView';
import { SynergiesView } from './multi-project/SynergiesView';
import { ResourceAllocationView } from './multi-project/ResourceAllocationView';
import { PortfolioOptimizationView } from './multi-project/PortfolioOptimizationView';

interface MultiProjectOrchestratorProps {
  currentProjectId: string;
  agents: Agent[];
  userStats: any;
}

export function MultiProjectOrchestrator({
  currentProjectId,
  agents,
  userStats
}: MultiProjectOrchestratorProps) {
  const {
    projects,
    synergies,
    resourceAllocation,
    isOptimizing,
    selectedProject,
    setSelectedProject,
    handleImplementSynergy,
    isLoading
  } = useMultiProjectOrchestrator(currentProjectId, agents);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Widgets */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Projects</p>
              <p className="text-2xl font-bold text-primary">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <Layers className="h-6 w-6 text-primary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Portfolio Progress</p>
              <p className="text-2xl font-bold text-secondary">{getTotalProjectProgress(projects)}%</p>
            </div>
            <TrendingUp className="h-6 w-6 text-secondary" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Agents</p>
              <p className="text-2xl font-bold text-accent">{getActiveAgentsCount(agents)}</p>
            </div>
            <Users className="h-6 w-6 text-accent" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Synergies Found</p>
              <p className="text-2xl font-bold text-primary">{synergies.length}</p>
            </div>
            <Zap className="h-6 w-6 text-primary" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Project Portfolio</TabsTrigger>
          <TabsTrigger value="synergies">Cross-Project Synergies</TabsTrigger>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          <TabsTrigger value="optimization">Portfolio Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <PortfolioView 
            projects={projects}
            selectedProject={selectedProject}
            onSelectProject={setSelectedProject}
            onCreateProject={() => console.log('Create project')}
          />
        </TabsContent>

        <TabsContent value="synergies">
          <SynergiesView 
            synergies={synergies}
            projects={projects}
            onImplement={handleImplementSynergy}
            isOptimizing={isOptimizing}
          />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceAllocationView 
            resourceAllocation={resourceAllocation}
            projects={projects}
          />
        </TabsContent>

        <TabsContent value="optimization">
          <PortfolioOptimizationView />
        </TabsContent>
      </Tabs>
    </div>
  );
}