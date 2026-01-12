# Deployment Guide

**Production deployment guide for FlashFusion**

> 📖 For detailed platform-specific instructions, see [Deployment Guide](src/docs/DEPLOYMENT_GUIDE.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Options](#deployment-options)
4. [Quick Deploy (Vercel)](#quick-deploy-vercel)
5. [Environment Configuration](#environment-configuration)
6. [Build Process](#build-process)
7. [Pre-Launch Checklist](#pre-launch-checklist)
8. [Post-Deployment](#post-deployment)
9. [Troubleshooting](#troubleshooting)

---

## Overview

FlashFusion is designed to be deployed as a static site with serverless backend services. The recommended deployment platform is **Vercel**, but the application can be deployed to any static hosting provider.

### Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│                  CDN / Edge Network                  │
│              (Vercel, Cloudflare, etc.)              │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────┴───────────────────────────────────┐
│              Static Assets (Build Output)            │
│         (HTML, CSS, JS, Images, Fonts)               │
└─────────────────┬───────────────────────────────────┘
                  │
                  │ API Calls
                  │
┌─────────────────┴───────────────────────────────────┐
│              Backend Services (Supabase)             │
│    (Auth, Database, Storage, Realtime, Edge Funcs)  │
└──────────────────────────────────────────────────────┘
```

---

## Prerequisites

Before deploying, ensure you have:

### Required Accounts

- ✅ **GitHub account** (for repository)
- ✅ **Vercel account** (or alternative hosting)
- ✅ **Supabase project** (backend services)
- ✅ **Domain name** (optional, for custom domain)

### Required Tools

- ✅ **Node.js 18+** installed locally
- ✅ **Git** for version control
- ✅ **npm or pnpm** for package management

### Configuration Ready

- ✅ All environment variables defined
- ✅ Supabase project configured
- ✅ API keys obtained
- ✅ Database schema deployed

---

## Deployment Options

### Recommended: Vercel (Easiest)

**Pros:**
- Zero configuration for Vite projects
- Automatic deployments from Git
- Built-in CI/CD
- Edge network (fast globally)
- Free tier available

**Best for:** Most users, especially beginners

### Alternative Options

| Platform | Complexity | Free Tier | Best For |
|----------|------------|-----------|----------|
| **Netlify** | Easy | Yes | Static sites, forms |
| **Cloudflare Pages** | Easy | Yes | Global performance |
| **AWS Amplify** | Medium | Limited | AWS ecosystem |
| **GitHub Pages** | Easy | Yes | Public repos only |
| **Self-hosted** | Hard | N/A | Full control |

---

## Quick Deploy (Vercel)

### Method 1: Deploy from GitHub (Recommended)

**Step 1: Push to GitHub**

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote
git remote add origin https://github.com/yourusername/flashfusion.git
git push -u origin main
```

**Step 2: Import to Vercel**

1. Go to [vercel.com](https://vercel.com/)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables (see below)
6. Click "Deploy"

**Step 3: Configure Domain (Optional)**

1. Go to project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Method 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (will prompt for configuration)
vercel

# Deploy to production
vercel --prod
```

---

## Environment Configuration

### Required Environment Variables

Create environment variables in your deployment platform:

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: AI Service Keys
VITE_OPENAI_API_KEY=your-openai-key

# Application Configuration
VITE_APP_URL=https://your-domain.com
VITE_ENVIRONMENT=production
```

### Setting Environment Variables

#### Vercel (via Dashboard)

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - **Name**: Variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: Your value
   - **Environment**: Select Production, Preview, or Development
3. Click "Save"

#### Vercel (via CLI)

```bash
# Add environment variable
vercel env add VITE_SUPABASE_URL production

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VITE_SUPABASE_URL production
```

#### Other Platforms

- **Netlify**: Site settings → Environment variables
- **Cloudflare Pages**: Settings → Environment variables
- **AWS Amplify**: App settings → Environment variables

### Security Notes

⚠️ **Important Security Practices:**

- Never commit `.env` files to Git
- Use `VITE_` prefix for public environment variables
- Keep service role keys server-side only
- Rotate keys regularly
- Use different keys for production and development

---

## Build Process

### Local Build Test

Test the production build locally before deploying:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview production build
npm run preview
```

**Verify:**
- ✅ Build completes without errors
- ✅ No console warnings
- ✅ All features work correctly
- ✅ Bundle size is optimized
- ✅ Assets load properly

### Build Optimization

The build process automatically:

- Minifies JavaScript and CSS
- Optimizes images
- Generates source maps
- Tree-shakes unused code
- Code-splits for lazy loading
- Generates service worker (if enabled)

### Build Configuration

Build settings in `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  }
});
```

---

## Pre-Launch Checklist

### Code Quality

- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Code reviewed and approved
- [ ] Performance optimized
- [ ] Accessibility verified

### Configuration

- [ ] Environment variables set
- [ ] Supabase configured correctly
- [ ] Database migrations applied
- [ ] Row-level security policies enabled
- [ ] API rate limits configured

### Content & Assets

- [ ] All placeholder content replaced
- [ ] Images optimized
- [ ] Fonts loaded correctly
- [ ] Favicon and meta tags set
- [ ] SEO optimization complete

### Security

- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] CORS configured correctly
- [ ] Security headers set
- [ ] Content Security Policy configured

### Testing

- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Tested all user workflows
- [ ] Load testing completed
- [ ] Security audit performed

### Monitoring

- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Backup strategy in place

---

## Post-Deployment

### Verify Deployment

**Check these immediately after deployment:**

1. **Site loads correctly**
   ```bash
   curl -I https://your-domain.com
   # Should return 200 OK
   ```

2. **All routes work**
   - Test main navigation
   - Test authentication
   - Test key features

3. **API connections work**
   - Test Supabase connection
   - Test AI tool integration
   - Test real-time features

4. **Performance metrics**
   - Check Lighthouse score
   - Monitor Core Web Vitals
   - Verify load times

### Monitor Initial Traffic

**First 24-48 hours:**

- Monitor error rates
- Check performance metrics
- Review user feedback
- Watch resource usage
- Monitor API limits

### Common Post-Deployment Tasks

```bash
# View deployment logs
vercel logs your-deployment-url

# Roll back if needed
vercel rollback

# Promote a specific deployment
vercel promote your-deployment-url
```

### Performance Monitoring

Set up monitoring for:

- **Uptime**: UptimeRobot, Pingdom
- **Performance**: Vercel Analytics, Google PageSpeed Insights
- **Errors**: Sentry, LogRocket
- **Analytics**: Google Analytics, Plausible

---

## Troubleshooting

### Common Deployment Issues

#### Build Fails

**Symptom**: Build process fails with errors

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

#### Environment Variables Not Working

**Symptom**: App can't connect to services

**Solutions:**
1. Verify variables are prefixed with `VITE_` for client-side use
2. Check variables are set in correct environment (production/preview)
3. Redeploy after adding variables
4. Verify no typos in variable names

#### 404 Errors on Routes

**Symptom**: Refresh on routes gives 404

**Solutions:**
1. Configure redirect rules for SPA
2. For Vercel, create `vercel.json`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

#### Slow Performance

**Symptom**: Site loads slowly

**Solutions:**
1. Enable Vercel Edge Network
2. Optimize images (WebP format)
3. Enable caching headers
4. Use code splitting
5. Lazy load components

#### CORS Errors

**Symptom**: API requests fail with CORS error

**Solutions:**
1. Configure CORS in Supabase settings
2. Add your domain to allowed origins
3. Verify API URLs are correct

### Getting Help

If you encounter issues:

1. Check [Deployment Complete Guide](src/DEPLOYMENT_COMPLETE_GUIDE.md)
2. Review [Production Launch Checklist](src/PRODUCTION_LAUNCH_FINAL_CHECKLIST.md)
3. Check [Development Troubleshooting](src/DEVELOPMENT_TROUBLESHOOTING.md)
4. Open an issue on GitHub
5. Contact support

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:

- **Production**: Pushes to `main` branch
- **Preview**: Pull requests and other branches

### Deployment Workflow

```
Code Change → Git Push → Automatic Build → Deploy → Verify
```

### Environment-Specific Deployments

```bash
# Production deployment (main branch)
git push origin main

# Preview deployment (feature branch)
git checkout -b feature/new-feature
git push origin feature/new-feature
```

---

## Related Documentation

- [Deployment Complete Guide](src/DEPLOYMENT_COMPLETE_GUIDE.md)
- [Production Launch Checklist](src/PRODUCTION_LAUNCH_FINAL_CHECKLIST.md)
- [Repository Services Setup](src/REPOSITORY_SERVICES_SETUP_GUIDE.md)
- [GitHub Setup Guide](src/GITHUB_SETUP_GUIDE.md)
- [Vercel Multi-Domain Setup](src/VERCEL_MULTI_DOMAIN_SETUP.md)

---

**Last Updated**: January 2026  
**Deployment Guide Version**: 1.0

🚀 **Ready to deploy? Start with the [Quick Deploy](#quick-deploy-vercel) section!**
