# Quick Start Guide

**Get FlashFusion running in 10 minutes**

> 📖 For comprehensive setup, see [START_HERE.md](src/START_HERE.md)

---

## Prerequisites

Ensure you have these installed:

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Supabase account** ([Sign up](https://supabase.com/))

Verify installations:

```bash
node --version  # Should be 18+
git --version   # Any recent version
```

---

## Installation (5 minutes)

### 1. Clone Repository

```bash
git clone https://github.com/Krosebrook/Flashfusionwebsitev20.git
cd Flashfusionwebsitev20
```

### 2. Install Dependencies

```bash
npm install
```

This may take 2-3 minutes depending on your internet connection.

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your favorite editor
nano .env  # or code .env, vim .env, etc.
```

**Minimum required configuration:**

```env
# Get these from: https://app.supabase.com/project/_/settings/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> 💡 **Tip**: See [API Keys Guide](src/API_KEYS_REQUIRED.md) for detailed key setup

### 4. Start Development Server

```bash
npm run dev
```

The app will open at **http://localhost:5173**

---

## First Steps

Once running:

1. ✅ **Sign up** - Create your first account
2. ✅ **Explore tools** - Browse the 60+ AI tools
3. ✅ **Create project** - Try the project builder
4. ✅ **Check dashboard** - View your profile and XP

---

## Common Issues

### "Module not found"

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "Cannot connect to Supabase"

1. Check your `.env` file has correct values
2. Verify Supabase project is active
3. Check internet connection

### Port 5173 already in use

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

---

## Next Steps

### Development

- 📖 [Development Setup](src/docs/DEVELOPMENT_SETUP.md) - Complete dev guide
- 🎨 [Styling Guide](src/FLASHFUSION_STYLING_GUIDE.md) - Design system
- 🧪 [Testing Guide](TESTING.md) - Writing tests

### Features

- 🤖 [AI Tools Inventory](src/AI_TOOLS_COMPLETE_INVENTORY.md) - All 60+ tools
- 📊 [Feature List](src/COMPLETE_FEATURE_LIST.md) - Complete features
- 🎮 [User Workflows](src/COMPLETE_USER_WORKFLOWS_AND_DELIVERABLES.md) - How to use

### Deployment

- 🚀 [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- ✅ [Launch Checklist](src/PRODUCTION_LAUNCH_FINAL_CHECKLIST.md) - Pre-launch steps

### Contributing

- 🤝 [Contributing Guide](src/CONTRIBUTING.md) - How to contribute
- 📋 [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines

---

## Available Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run tests
npm run test:coverage   # Run with coverage

# Code Quality
npm run lint            # Lint code
npm run type-check      # Check TypeScript
```

---

## Help & Support

- 📚 [Documentation Index](DOCUMENTATION_INDEX.md) - All docs
- 🐛 [Report Bug](.github/ISSUE_TEMPLATE/bug_report.md) - Found a bug?
- 💬 [Discussions](https://github.com/Krosebrook/Flashfusionwebsitev20/discussions) - Ask questions
- 🔒 [Security](SECURITY.md) - Report security issues

---

## Success Checklist

After setup, you should have:

- ✅ Dev server running at http://localhost:5173
- ✅ Able to sign up and log in
- ✅ Can access dashboard
- ✅ Can create a test project
- ✅ No console errors

---

## What's Next?

**Choose your path:**

### 👤 As a User
→ [User Manual](src/docs/USER_MANUAL.md)

### 👨‍💻 As a Developer
→ [Architecture Guide](ARCHITECTURE.md)

### 🚀 Ready to Deploy
→ [Deployment Guide](DEPLOYMENT.md)

---

**Need more help?** Check the [comprehensive setup guide](src/START_HERE.md)

🎉 **Welcome to FlashFusion!**
