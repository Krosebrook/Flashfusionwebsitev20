import { Card } from '../../ui/card';
import { ResourceAllocationCard } from './ResourceAllocationCard';
import { Project } from '../../../types/multi-agent-orchestration';

interface ResourceAllocationViewProps {
  resourceAllocation: any[];
  projects: Project[];
}

export function ResourceAllocationView({ 
  resourceAllocation, 
  projects 
}: ResourceAllocationViewProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Agent Resource Allocation</h3>
      <div className="space-y-4">
        {resourceAllocation.map((resource) => (
          <ResourceAllocationCard
            key={resource.agentId}
            resource={resource}
            projects={projects}
          />
        ))}
      </div>
    </Card>
  );
}