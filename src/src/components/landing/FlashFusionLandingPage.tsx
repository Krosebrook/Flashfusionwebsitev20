/**
 * @fileoverview FlashFusion Landing Page
 * @chunk landing
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * Main landing page showcasing platform features and value proposition.
 */

import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Code, Zap, Globe, Shield, Cpu, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

export default function FlashFusionLandingPage() {
  const handleGetStarted = () => {
    window.location.href = '/auth?mode=signup';
  };

  const handleDemo = () => {
    window.location.href = '/demo';
  };

  return (
    <div className="min-h-screen bg-[var(--ff-bg-dark)] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[var(--ff-bg-dark)]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)]">
                FlashFusion
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#solutions" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Solutions</a>
              <a href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Pricing</a>
              <Button onClick={handleGetStarted} className="ff-btn-primary">Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--ff-primary)]/20 via-[var(--ff-bg-dark)] to-[var(--ff-bg-dark)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Build Production Apps <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--ff-primary)] via-[var(--ff-secondary)] to-[var(--ff-accent)]">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Transform your ideas into full-stack applications in minutes. 
              FlashFusion orchestrates design, code, and deployment automatically.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={handleGetStarted} className="ff-btn-primary w-full sm:w-auto h-14 px-8 text-lg">
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" onClick={handleDemo} variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-white/20 hover:bg-white/5">
                Try Interactive Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-[var(--ff-surface)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to ship</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools for every stage of development, from concept to scale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-[var(--ff-primary)]" />}
              title="Instant Generation"
              description="Generate full-stack React & Node.js applications from natural language descriptions."
            />
            <FeatureCard 
              icon={<Code className="w-6 h-6 text-[var(--ff-secondary)]" />}
              title="Clean Code"
              description="Production-ready, TypeScript code that follows best practices and is easy to maintain."
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-[var(--ff-accent)]" />}
              title="One-Click Deploy"
              description="Deploy instantly to Vercel, Netlify, or AWS with pre-configured CI/CD pipelines."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-green-400" />}
              title="Enterprise Security"
              description="Built-in authentication, role-based access control, and data encryption."
            />
            <FeatureCard 
              icon={<Cpu className="w-6 h-6 text-purple-400" />}
              title="AI Orchestration"
              description="Seamlessly integrate multiple AI models (GPT-4, Claude, Gemini) into your apps."
            />
            <FeatureCard 
              icon={<Layers className="w-6 h-6 text-orange-400" />}
              title="Scalable Architecture"
              description="Microservices-ready architecture that grows with your user base."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-[var(--ff-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-white">FlashFusion</span>
              <p className="text-sm text-gray-400 mt-2">© 2024 FlashFusion Inc.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-[var(--ff-surface)] border-white/5 hover:border-[var(--ff-primary)]/50 transition-colors duration-300">
      <CardHeader>
        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400 leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}