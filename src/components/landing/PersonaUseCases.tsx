import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Video, 
  Gamepad2, 
  ShoppingBag, 
  Code, 
  Building2, 
  ArrowRight,
  Check
} from 'lucide-react';

const USE_CASES = [
  {
    id: 'creator',
    title: 'Content Creators',
    icon: <Video className="w-6 h-6" />,
    description: 'Automate your content pipeline from script to publish.',
    features: ['Video Script Generation', 'Thumbnail Design', 'Social Scheduling'],
    color: 'text-pink-500',
    bg: 'bg-pink-500/10'
  },
  {
    id: 'gamedev',
    title: 'Game Developers',
    icon: <Gamepad2 className="w-6 h-6" />,
    description: 'Prototype and deploy games to web and mobile.',
    features: ['Unity/Unreal Logic', 'Asset Generation', 'Multi-platform Deploy'],
    color: 'text-purple-500',
    bg: 'bg-purple-500/10'
  },
  {
    id: 'business',
    title: 'Small Business',
    icon: <ShoppingBag className="w-6 h-6" />,
    description: 'Launch your online presence in minutes.',
    features: ['E-commerce Store', 'Booking System', 'SEO-Optimized Copy'],
    color: 'text-blue-500',
    bg: 'bg-blue-500/10'
  },
  {
    id: 'startup',
    title: 'Startups',
    icon: <Code className="w-6 h-6" />,
    description: 'Build your MVP and scale without hiring a team.',
    features: ['Full-Stack SaaS', 'Database Setup', 'User Auth Integration'],
    color: 'text-green-500',
    bg: 'bg-green-500/10'
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Secure, scalable internal tools for large teams.',
    features: ['SSO & Audit Logs', 'On-premise Options', 'Custom AI Models'],
    color: 'text-orange-500',
    bg: 'bg-orange-500/10'
  }
];

export function PersonaUseCases() {
  const [activeCase, setActiveCase] = useState(USE_CASES[0]);

  return (
    <section className="py-20 bg-[var(--ff-bg-dark)]/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold ff-text-headline">
            Built for Every Creator
          </h2>
          <p className="text-[var(--ff-text-secondary)] max-w-2xl mx-auto">
            Whether you're a solo creator or a scaling enterprise, FlashFusion adapts to your workflow.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Menu */}
          <div className="lg:col-span-4 space-y-3">
            {USE_CASES.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActiveCase(useCase)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-4 border ${
                  activeCase.id === useCase.id
                    ? 'bg-[var(--ff-surface)] border-[var(--ff-primary)] shadow-lg shadow-[var(--ff-primary)]/5'
                    : 'border-transparent hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-lg ${useCase.bg} ${useCase.color}`}>
                  {useCase.icon}
                </div>
                <span className={`font-semibold ${activeCase.id === useCase.id ? 'text-white' : 'text-[var(--ff-text-muted)]'}`}>
                  {useCase.title}
                </span>
                {activeCase.id === useCase.id && (
                  <ArrowRight className="w-4 h-4 ml-auto text-[var(--ff-primary)]" />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-8">
            <Card className="h-full bg-[var(--ff-surface)] border-white/10 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-[var(--ff-primary)]/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl ${activeCase.bg} ${activeCase.color}`}>
                    {activeCase.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{activeCase.title} Workflow</h3>
                </div>

                <p className="text-lg text-[var(--ff-text-secondary)]">
                  {activeCase.description}
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  {activeCase.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                      <Check className="w-5 h-5 text-[var(--ff-primary)]" />
                      <span className="text-sm font-medium text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-8 mt-8 border-t border-white/10 flex gap-4">
                  <Button className="ff-btn-primary">
                    Start {activeCase.title} Project
                  </Button>
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    View Templates
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
