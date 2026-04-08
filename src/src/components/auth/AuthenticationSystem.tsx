/**
 * @fileoverview Desktop Authentication System
 * @chunk auth
 * @category authentication
 * @version 2.0.0
 * @author FlashFusion Team
 * 
 * Desktop-optimized authentication system with enhanced UI/UX.
 * Reuses core logic from MobileAuthenticationSystem but optimized for larger screens.
 */

import React from 'react';
import { MobileAuthenticationSystem } from './MobileAuthenticationSystem';
import { Card, CardContent } from '../ui/card';

// Reuse the types from MobileAuthenticationSystem
import type { AuthUser } from './MobileAuthenticationSystem';

interface AuthenticationSystemProps {
  onAuthSuccess: (user: AuthUser) => void;
  onAuthError: (error: string) => void;
  onClose?: () => void;
}

export const AuthenticationSystem: React.FC<AuthenticationSystemProps> = (props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--ff-bg-dark)] p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--ff-primary)]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[var(--ff-secondary)]/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--ff-primary)] to-[var(--ff-secondary)]">
            FlashFusion
          </h1>
          <p className="text-[var(--ff-text-secondary)]">
            The AI-Native Application Platform
          </p>
        </div>

        {/* We reuse the MobileAuthenticationSystem as the core form logic is identical,
            but we wrap it to ensure it fits the desktop aesthetic. */}
        <MobileAuthenticationSystem {...props} />

        <div className="mt-8 text-center text-sm text-[var(--ff-text-muted)]">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-[var(--ff-primary)] hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-[var(--ff-primary)] hover:underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
};

export default AuthenticationSystem;