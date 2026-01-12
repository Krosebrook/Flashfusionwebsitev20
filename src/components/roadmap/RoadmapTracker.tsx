import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

interface Milestone {
  phase: string;
  title: string;
  timeline: string;
  status: 'completed' | 'in-progress' | 'planned';
  items: { text: string; completed: boolean }[];
}

const ROADMAP_DATA: Milestone[] = [
  {
    phase: 'Phase 1',
    title: 'Critical Fixes & Stabilization',
    timeline: 'Weeks 1-4',
    status: 'in-progress',
    items: [
      { text: 'Resolve Build System Issues (Node 22+)', completed: false },
      { text: 'Complete Repository Consolidation (7/54)', completed: false },
      { text: 'Activate Mirror Synchronization', completed: false },
      { text: 'Unified Testing Strategy', completed: false },
      { text: 'Security Hardening', completed: false }
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Quality & Core Agents',
    timeline: 'Weeks 5-8',
    status: 'planned',
    items: [
      { text: 'Complete Security Audit', completed: false },
      { text: 'Optimize Build Pipeline (Turbo)', completed: false },
      { text: 'Implement Core Agents (Claude, Gemini)', completed: false },
      { text: 'Agent Auto-Selection', completed: false }
    ]
  },
  {
    phase: 'Phase 3',
    title: 'Feature Development',
    timeline: 'Weeks 9-12',
    status: 'planned',
    items: [
      { text: 'Developer Scaffolding CLI', completed: false },
      { text: 'OTEL Observability', completed: false },
      { text: 'Hot Module Reloading', completed: false }
    ]
  },
  {
    phase: 'Phase 4',
    title: 'Feature Expansion',
    timeline: 'Months 3-6',
    status: 'planned',
    items: [
      { text: 'Agent Orchestration', completed: false },
      { text: 'Multi-Environment Support', completed: false },
      { text: 'Supabase Database Integration', completed: false },
      { text: 'External Integrations (Stripe, Twilio)', completed: false }
    ]
  }
];

export function RoadmapTracker() {
  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'in-progress': return 'text-[var(--ff-primary)] bg-[var(--ff-primary)]/10 border-[var(--ff-primary)]/20';
      case 'planned': return 'text-[var(--ff-text-muted)] bg-white/5 border-white/10';
    }
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5" />;
      case 'in-progress': return <Clock className="w-5 h-5 animate-pulse" />;
      case 'planned': return <Circle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-bold ff-text-headline">Product Roadmap</h2>
        <p className="text-[var(--ff-text-secondary)]">
          Transparent view of our development journey towards V1.0
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {ROADMAP_DATA.map((milestone, index) => (
          <Card key={index} className={`ff-card ${milestone.status === 'in-progress' ? 'border-[var(--ff-primary)] shadow-lg shadow-[var(--ff-primary)]/5' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="outline" className={`mb-2 ${getStatusColor(milestone.status)}`}>
                    {milestone.phase} • {milestone.timeline}
                  </Badge>
                  <CardTitle className="text-lg font-bold text-white">
                    {milestone.title}
                  </CardTitle>
                </div>
                <div className={`${milestone.status === 'in-progress' ? 'text-[var(--ff-primary)]' : 'text-[var(--ff-text-muted)]'}`}>
                  {getStatusIcon(milestone.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {milestone.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[var(--ff-text-secondary)]">
                    {item.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 border border-white/20 rounded-full mt-0.5 shrink-0" />
                    )}
                    <span className={item.completed ? 'line-through opacity-50' : ''}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-xs text-[var(--ff-text-muted)]">
          Source: Source-of-Truth Monorepo (Updated 2025-12-30)
        </p>
      </div>
    </div>
  );
}
