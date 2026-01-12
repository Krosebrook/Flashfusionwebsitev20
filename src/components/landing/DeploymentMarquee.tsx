import React from 'react';
import { Card } from '../ui/card';

const PLATFORMS = [
  { name: 'Vercel', icon: '▲' },
  { name: 'AWS', icon: '☁️' },
  { name: 'Netlify', icon: '🌐' },
  { name: 'Google Cloud', icon: '🔵' },
  { name: 'Azure', icon: '🔷' },
  { name: 'Shopify', icon: '🛍️' },
  { name: 'WordPress', icon: '📝' },
  { name: 'YouTube', icon: '▶️' },
  { name: 'TikTok', icon: '🎵' },
  { name: 'Instagram', icon: '📸' },
  { name: 'LinkedIn', icon: '💼' },
  { name: 'Medium', icon: '✍️' },
  { name: 'Substack', icon: '📧' },
  { name: 'GitHub', icon: '🐙' },
  { name: 'GitLab', icon: '🦊' },
  { name: 'Heroku', icon: '⚛️' },
  { name: 'DigitalOcean', icon: '🌊' },
  { name: 'Cloudflare', icon: '🌩️' },
  { name: 'Firebase', icon: '🔥' },
  { name: 'Supabase', icon: '⚡' },
];

export function DeploymentMarquee() {
  return (
    <section className="py-20 border-y border-white/5 bg-[var(--ff-bg-dark)]">
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <h3 className="text-2xl font-bold text-white mb-4">
          Deploy Anywhere with One Click
        </h3>
        <p className="text-[var(--ff-text-secondary)]">
          FlashFusion integrates with 20+ leading platforms for instant publishing.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
          {[...PLATFORMS, ...PLATFORMS].map((platform, idx) => (
            <div 
              key={idx}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--ff-surface)] border border-white/10 text-[var(--ff-text-secondary)] hover:text-white hover:border-[var(--ff-primary)] transition-colors duration-300 min-w-[140px] justify-center"
            >
              <span className="text-xl">{platform.icon}</span>
              <span className="font-medium">{platform.name}</span>
            </div>
          ))}
        </div>
        
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex gap-8 py-4">
           {[...PLATFORMS, ...PLATFORMS].map((platform, idx) => (
            <div 
              key={`dup-${idx}`}
               className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[var(--ff-surface)] border border-white/10 text-[var(--ff-text-secondary)] hover:text-white hover:border-[var(--ff-primary)] transition-colors duration-300 min-w-[140px] justify-center"
            >
              <span className="text-xl">{platform.icon}</span>
              <span className="font-medium">{platform.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
