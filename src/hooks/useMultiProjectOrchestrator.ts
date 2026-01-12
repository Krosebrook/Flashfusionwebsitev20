import { useState, useEffect } from 'react';
import { Agent, CrossProjectSynergy, Project } from '../types/multi-agent-orchestration';
import { SAMPLE_PROJECTS, SAMPLE_SYNERGIES } from '../constants/multi-project-orchestrator';
import { generateResourceAllocation } from '../utils/multi-project-orchestrator';
import { projectId, publicAnonKey } from '../utils/supabase/info';

export function useMultiProjectOrchestrator(currentProjectId: string, agents: Agent[]) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [synergies, setSynergies] = useState<CrossProjectSynergy[]>([]);
  const [resourceAllocation, setResourceAllocation] = useState<any[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedProject, setSelectedProject] = useState(currentProjectId);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-88829a40`;

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      analyzeCrossProjectSynergies();
      optimizeResourceAllocation();
    }
  }, [projects, agents]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      const data = await response.json();
      
      if (data.success && data.projects.length > 0) {
        setProjects(data.projects);
      } else {
        // Fallback to sample data if no projects exist
        setProjects(SAMPLE_PROJECTS);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects(SAMPLE_PROJECTS); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const saveProject = async (project: Project) => {
    try {
      await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });
      // Refresh projects
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const analyzeCrossProjectSynergies = async () => {
    // In a real app, this would be an API call to an AI service
    // For now, we simulate AI analysis locally or use sample data
    setSynergies(SAMPLE_SYNERGIES);
  };

  const optimizeResourceAllocation = () => {
    const allocation = generateResourceAllocation(agents, projects);
    setResourceAllocation(allocation);
  };

  const handleImplementSynergy = async (synergyId: string) => {
    setIsOptimizing(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSynergies(prev => prev.map(s => 
      s.projectIds.join('-') === synergyId 
        ? { ...s, implementationEffort: 'completed' as any }
        : s
    ));
    
    setIsOptimizing(false);
  };

  return {
    projects,
    synergies,
    resourceAllocation,
    isOptimizing,
    selectedProject,
    setSelectedProject,
    handleImplementSynergy,
    isLoading,
    saveProject
  };
}
