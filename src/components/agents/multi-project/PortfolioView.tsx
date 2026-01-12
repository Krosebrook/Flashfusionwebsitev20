import { Plus } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { ProjectCard } from './ProjectCard';
import { Project } from '../../../types/multi-agent-orchestration';

interface PortfolioViewProps {
  projects: Project[];
  selectedProject: string;
  onSelectProject: (id: string) => void;
  onCreateProject: () => void;
}

export function PortfolioView({ 
  projects, 
  selectedProject, 
  onSelectProject,
  onCreateProject 
}: PortfolioViewProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            isSelected={selectedProject === project.id}
            onSelect={onSelectProject}
            index={index}
          />
        ))}
      </div>

      <Card className="p-6 border-dashed border-2 border-border">
        <div className="text-center space-y-3">
          <Plus className="h-8 w-8 text-muted-foreground mx-auto" />
          <div>
            <h3 className="font-semibold">Start New Project</h3>
            <p className="text-sm text-muted-foreground">
              Add another project to your portfolio and optimize resource allocation
            </p>
          </div>
          <Button className="mt-4" onClick={onCreateProject}>Create New Project</Button>
        </div>
      </Card>
    </div>
  );
}