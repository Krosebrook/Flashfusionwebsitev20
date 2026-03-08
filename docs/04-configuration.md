# Configuration & Customization Guide

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** Developers, DevOps

---

## Table of Contents

1. [Environment Variables Reference](#1-environment-variables-reference)
2. [Vite Configuration](#2-vite-configuration)
3. [Tailwind CSS Configuration](#3-tailwind-css-configuration)
4. [Design Token Customisation](#4-design-token-customisation)
5. [Supabase Configuration](#5-supabase-configuration)
6. [Feature Flags](#6-feature-flags)
7. [Third-Party Service Configuration](#7-third-party-service-configuration)

---

## 1. Environment Variables Reference

Create `.env.local` at the project root (never commit this file).

### Required

| Variable | Type | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | URL string | Your Supabase project API URL |
| `VITE_SUPABASE_ANON_KEY` | string | Supabase public anon key (safe for client) |

### Application

| Variable | Type | Default | Description |
|---|---|---|---|
| `VITE_APP_URL` | URL string | `http://localhost:5173` | Public URL of the application |
| `VITE_APP_ENV` | `development` \| `staging` \| `production` | `development` | Current environment |
| `VITE_APP_NAME` | string | `FlashFusion` | Application display name |

### AI Services (optional)

| Variable | Type | Description |
|---|---|---|
| `VITE_OPENAI_API_KEY` | string | OpenAI API key for AI tool features |
| `VITE_ANTHROPIC_API_KEY` | string | Anthropic Claude API key |

> ⚠️ **Security warning:** `VITE_*` variables are embedded into the client bundle and exposed to all users. Place sensitive server-only keys in Supabase Edge Function environment variables instead, not in `VITE_*` variables.

### Analytics & Monitoring (optional)

| Variable | Type | Description |
|---|---|---|
| `VITE_SENTRY_DSN` | URL string | Sentry error reporting DSN |
| `VITE_MIXPANEL_TOKEN` | string | Mixpanel analytics token |
| `VITE_GA_MEASUREMENT_ID` | string | Google Analytics 4 Measurement ID |

### GitHub Integration (optional)

| Variable | Type | Description |
|---|---|---|
| `VITE_GITHUB_CLIENT_ID` | string | GitHub OAuth App client ID |

### Example `.env.example` file

```dotenv
# Copy this file to .env.local and fill in your values
# DO NOT commit .env.local

# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Application
VITE_APP_URL=http://localhost:5173
VITE_APP_ENV=development

# Optional - AI Services
VITE_OPENAI_API_KEY=
VITE_ANTHROPIC_API_KEY=

# Optional - Analytics
VITE_SENTRY_DSN=
VITE_MIXPANEL_TOKEN=
```

---

## 2. Vite Configuration

The build configuration lives in `vite.config.ts`.

### Key Settings

```typescript
// vite.config.ts (annotated)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],   // SWC-based fast transpilation
  resolve: {
    alias: {
      '@': '/src',      // Allows `import { X } from '@/components/...'`
    },
  },
  build: {
    // Target modern browsers; adjust if wider support needed
    target: 'es2020',
    // Enable rollup manual chunks for better cache utilisation
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  // Expose env variables to Vitest
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

### Adding a New Path Alias

```typescript
// In vite.config.ts resolve.alias
'@hooks': '/src/hooks',
'@lib': '/src/lib',
```

Also add to `tsconfig.json` paths to keep TypeScript happy:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@hooks/*": ["./src/hooks/*"]
    }
  }
}
```

---

## 3. Tailwind CSS Configuration

The Tailwind config (`tailwind.config.js` or `tailwind.config.ts`) extends the default theme with FlashFusion brand tokens.

### Adding a New Colour Token

1. Define the CSS variable in `src/styles/globals.css`:

```css
:root {
  --flashfusion-accent-new: 262 80% 50%;
}
.dark {
  --flashfusion-accent-new: 262 70% 60%;
}
```

2. Reference it in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      'accent-new': 'hsl(var(--flashfusion-accent-new) / <alpha-value>)',
    },
  },
},
```

3. Use in components: `className="bg-accent-new text-white"`

---

## 4. Design Token Customisation

All brand tokens are defined as CSS custom properties in `src/styles/globals.css`.

### Token Naming Convention

```
--flashfusion-<category>[-variant]
```

### Core Token Categories

| Category | Example Variable | Used For |
|---|---|---|
| Background | `--flashfusion-background` | Page background |
| Foreground | `--flashfusion-foreground` | Default text |
| Primary | `--flashfusion-primary` | Primary actions |
| Secondary | `--flashfusion-secondary` | Secondary elements |
| Accent | `--flashfusion-accent` | Highlights |
| Destructive | `--flashfusion-destructive` | Errors, deletions |
| Muted | `--flashfusion-muted` | Subdued UI elements |
| Border | `--flashfusion-border` | Borders |
| Radius | `--flashfusion-radius` | Border radius |

### Modifying the Brand Colour

To change the primary brand colour:

```css
/* src/styles/globals.css */
:root {
  /* Hue Saturation Lightness (no hsl() wrapper — Tailwind adds it) */
  --flashfusion-primary: 262 83% 58%;         /* purple */
  --flashfusion-primary-foreground: 0 0% 100%;
}
```

---

## 5. Supabase Configuration

### Client Initialisation

The Supabase client is initialised once and exported from a shared module:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';  // generated types

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
```

### Regenerating TypeScript Types

After schema changes:

```bash
supabase gen types typescript --project-id <project-id> > src/lib/database.types.ts
```

### Configuring Auth Redirect URLs

In Supabase dashboard → **Authentication** → **URL Configuration**:

| Setting | Development | Production |
|---|---|---|
| Site URL | `http://localhost:5173` | `https://flashfusion.dev` |
| Redirect URLs | `http://localhost:5173/**` | `https://flashfusion.dev/**` |

---

## 6. Feature Flags

Feature flags control rollout of in-progress features without separate deployments.

### Current Implementation

Feature flags are currently managed via environment variables:

```dotenv
VITE_FEATURE_AI_TOOLS=true
VITE_FEATURE_MULTI_AGENT=false
VITE_FEATURE_MARKETPLACE=false
```

### Usage in Components

```typescript
const isAiToolsEnabled = import.meta.env.VITE_FEATURE_AI_TOOLS === 'true';

{isAiToolsEnabled && <AiToolsPanel />}
```

### Planned: Runtime Feature Flags

A database-driven feature flag system (via Supabase) is planned to enable per-user or per-organisation flag control without redeployments.

---

## 7. Third-Party Service Configuration

### Sentry (Error Monitoring)

```typescript
// src/main.tsx — initialise before rendering
import * as Sentry from '@sentry/react';

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_APP_ENV,
    tracesSampleRate: 0.1,  // 10% of transactions
  });
}
```

### Mixpanel (Analytics)

```typescript
// src/lib/analytics.ts
import mixpanel from 'mixpanel-browser';

if (import.meta.env.PROD && import.meta.env.VITE_MIXPANEL_TOKEN) {
  mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN);
}

export function trackEvent(event: string, properties?: Record<string, unknown>) {
  if (import.meta.env.PROD) {
    mixpanel.track(event, properties);
  }
}
```

---

*Last Updated: 2026-03-08 | Owner: Engineering Team*
