import { CrossProjectSynergy, Project } from '../../../types/multi-agent-orchestration';
import { SynergyCard } from './SynergyCard';

interface SynergiesViewProps {
  synergies: CrossProjectSynergy[];
  projects: Project[];
  onImplement: (id: string) => void;
  isOptimizing: boolean;
}

export function SynergiesView({ 
  synergies, 
  projects, 
  onImplement, 
  isOptimizing 
}: SynergiesViewProps) {
  return (
    <div className="space-y-4">
      {synergies.map((synergy, index) => (
        <SynergyCard
          key={`${synergy.projectIds.join('-')}`}
          synergy={synergy}
          projects={projects}
          onImplement={onImplement}
          isOptimizing={isOptimizing}
          index={index}
        />
      ))}
    </div>
  );
}