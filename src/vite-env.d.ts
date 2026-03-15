/// <reference types="vite/client" />

// Google Analytics gtag global
interface Window {
  gtag: (
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date,
    config?: Record<string, unknown>
  ) => void;
  dataLayer: unknown[];
}

// Figma asset imports
declare module 'figma:asset/*' {
  const src: string;
  export default src;
}

// Sentry (optional monitoring, may not be installed)
declare module '@sentry/react' {
  export function init(options: Record<string, unknown>): void;
  export function captureException(error: unknown, context?: Record<string, unknown>): string;
  export function captureMessage(message: string, level?: string): string;
  export function setUser(user: Record<string, unknown> | null): void;
  export function setTag(key: string, value: string): void;
  export function setContext(name: string, context: Record<string, unknown>): void;
  export function addBreadcrumb(breadcrumb: Record<string, unknown>): void;
  export function withScope(callback: (scope: Record<string, unknown>) => void): void;
  export const Severity: Record<string, string>;
}
