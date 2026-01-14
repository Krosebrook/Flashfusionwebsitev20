import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { 
  Code, 
  Palette, 
  Gamepad2, 
  ShoppingBag, 
  Briefcase, 
  ArrowRight, 
  CheckCircle,
  Cpu
} from 'lucide-react';
import { motion } from 'motion/react';

interface OnboardingFlowProps {
  onComplete: (persona: string, intent: string) => void;
  onSkip: () => void;
}

type PersonaType = 'creator' | 'developer' | 'business' | 'startup' | 'enterprise';

interface PersonaOption {
  id: PersonaType;
  title: string;
  icon: React.ReactNode;
  description: string;
  intents: string[];
}

const PERSONAS: PersonaOption[] = [
  {
    id: 'creator',
    title: 'Content Creator',
    icon: <Palette className="w-8 h-8 text-[var(--ff-secondary)]" />,
    description: 'YouTubers, Bloggers, Influencers looking to scale content.',
    intents: ['Video Scripts', 'Social Posts', 'Blog Articles', 'Digital Art']
  },
  {
    id: 'startup',
    title: 'Startup Founder',
    icon: <Rocket className="w-8 h-8 text-[var(--ff-primary)]" />,
    description: 'Building MVPs, SaaS products, and scaling quickly.',
    intents: ['Build SaaS MVP', 'Prototype App', 'Pitch Deck', 'Landing Page']
  },
  {
    id: 'business',
    title: 'Small Business',
    icon: <ShoppingBag className="w-8 h-8 text-[var(--ff-accent)]" />,
    description: 'E-commerce, Local Services, Agencies.',
    intents: ['Online Store', 'Business Website', 'Marketing Copy', 'Booking System']
  },
  {
    id: 'developer',
    title: 'Developer',
    icon: <Code className="w-8 h-8 text-emerald-400" />,
    description: 'Full-stack, Game Devs, DevOps automating workflows.',
    intents: ['Generate Code', 'Build Game', 'API Documentation', 'CI/CD Pipeline']
  },
  {
    id: 'enterprise',
    title: 'Enterprise',
    icon: <Briefcase className="w-8 h-8 text-purple-400" />,
    description: 'Large organizations needing security and scale.',
    intents: ['Internal Tools', 'Training Modules', 'Data Analytics', 'Security Audit']
  }
];

// Helper for icon since Rocket wasn't imported initially
function Rocket(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4-1 4-1" />
      <path d="M12 15v5s3.03-.55 4-2c1.1-1.62 1-4 1-4" />
    </svg>
  );
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [step, setStep] = useState<'persona' | 'intent'>('persona');
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);

  const handlePersonaSelect = (personaId: PersonaType) => {
    setSelectedPersona(personaId);
    setStep('intent');
  };

  const handleIntentSelect = (intent: string) => {
    setSelectedIntent(intent);
    if (selectedPersona) {
      onComplete(selectedPersona, intent);
    }
  };

  const selectedPersonaData = PERSONAS.find(p => p.id === selectedPersona);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ff-bg-dark)] p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ff-primary)]/10 border border-[var(--ff-primary)]/20 text-[var(--ff-primary)] text-sm font-medium"
          >
            <Cpu className="w-4 h-4" />
            <span>Personalize Your Experience</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white ff-text-headline">
            {step === 'persona' ? 'Who are you building for?' : 'What is your primary goal?'}
          </h1>
          <p className="text-[var(--ff-text-secondary)] text-lg max-w-2xl mx-auto">
            {step === 'persona' 
              ? 'Tell us about your role so we can tailor the FlashFusion tools to your needs.'
              : `Great! Let's narrow down what you want to achieve as a ${selectedPersonaData?.title}.`
            }
          </p>
        </div>

        {step === 'persona' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERSONAS.map((persona, index) => (
              <motion.div
                key={persona.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full cursor-pointer hover:border-[var(--ff-primary)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--ff-primary)]/10 group bg-[var(--ff-surface)] border-white/5"
                  onClick={() => handlePersonaSelect(persona.id)}
                >
                  <div className="p-6 space-y-4">
                    <div className="p-3 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300">
                      {persona.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{persona.title}</h3>
                      <p className="text-[var(--ff-text-muted)] text-sm leading-relaxed">
                        {persona.description}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center text-[var(--ff-primary)] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Select Persona <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6">
             <div className="grid grid-cols-1 gap-4">
              {selectedPersonaData?.intents.map((intent, index) => (
                <motion.button
                  key={intent}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleIntentSelect(intent)}
                  className="w-full text-left p-6 rounded-xl bg-[var(--ff-surface)] border border-white/5 hover:border-[var(--ff-secondary)] hover:bg-[var(--ff-secondary)]/5 transition-all duration-200 flex items-center justify-between group"
                >
                  <span className="text-lg font-medium text-white group-hover:text-[var(--ff-secondary)] transition-colors">
                    {intent}
                  </span>
                  <ArrowRight className="w-5 h-5 text-[var(--ff-text-muted)] group-hover:text-[var(--ff-secondary)] group-hover:translate-x-1 transition-all" />
                </motion.button>
              ))}
            </div>
            
            <button 
              onClick={() => setStep('persona')}
              className="text-[var(--ff-text-muted)] hover:text-white text-sm mt-8 flex items-center gap-2 mx-auto"
            >
              ← Back to roles
            </button>
          </div>
        )}

        <div className="mt-12 text-center">
          <button 
            onClick={onSkip}
            className="text-[var(--ff-text-muted)] hover:text-white text-sm underline decoration-white/20 hover:decoration-white/50 underline-offset-4 transition-all"
          >
            Skip personalization for now
          </button>
        </div>
      </div>
    </div>
  );
}
