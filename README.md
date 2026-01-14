# FlashFusionWebsite (Copy)

This is a code bundle for FlashFusionWebsite (Copy). The original project is available at https://www.figma.com/design/zUXETPxCx03cbuEuxidAnJ/FlashFusionWebsite--Copy-.

## 🚀 Recent Updates

### ✨ Enhanced Tool Functionality (Roadmap Item #2 - COMPLETED)
FlashFusion now includes a complete tool execution system with credit tracking and usage analytics:

- **Credit Management**: Track and manage user credits across Free, Pro, and Enterprise tiers
- **Tool Usage History**: Comprehensive tracking of all tool executions
- **Usage Analytics**: Success rates, processing times, most used tools
- **Demo Mode**: Fully functional without API keys for development
- **Secure Execution**: Transaction-safe credit consumption with RLS policies

See [TOOL_EXECUTION_GUIDE.md](./TOOL_EXECUTION_GUIDE.md) for complete documentation.

## 🏃 Running the Code

### Basic Setup
```bash
# Install dependencies
npm i

# Start development server
npm run dev
```

### With Supabase (Optional)
For full functionality with persistent data:

1. Set up Supabase project at https://supabase.com
2. Create `.env.local` file:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```
3. Run database migrations:
```bash
# Copy SQL from src/supabase/migrations/ and run in Supabase SQL editor
# Or use Supabase CLI:
supabase db push
```
4. Start the dev server:
```bash
npm run dev
```

## 📚 Documentation

- [Tool Execution Guide](./TOOL_EXECUTION_GUIDE.md) - Complete guide to the tool execution system
- [Changelog](./CHANGELOG.md) - Recent changes and updates
- [Roadmap](./src/ROADMAP.md) - Feature roadmap and priorities

## 🎯 Key Features

### Tool Execution System
- 30+ AI tools with credit-based usage
- Real-time credit balance tracking
- Detailed usage history and analytics
- Support for multiple subscription tiers
- Demo mode for testing without setup

### Credit Tiers
- **Free**: 1,000 credits/month
- **Pro**: 10,000 credits/month  
- **Enterprise**: Unlimited credits

### Security
- Row Level Security (RLS) for data isolation
- Transaction-safe credit operations
- Input validation and sanitization
- API key security (never exposed to client)

## 🛠️ Development

### Project Structure
```
src/
├── services/
│   ├── ToolExecutionService.ts    # Core tool execution and credits
│   └── AIService.ts                # AI model integrations
├── hooks/
│   └── useToolExecution.ts         # React hooks for tools
├── components/
│   └── tools/
│       ├── CreditBalanceDisplay.tsx       # Credit UI
│       ├── ToolUsageHistory.tsx           # Usage analytics UI
│       └── EnhancedToolExecutor.tsx       # Tool wrapper
└── supabase/
    └── migrations/
        └── 007_tool_execution_credits.sql # Database schema
```

### Testing
```bash
# Run in demo mode (no setup required)
npm run dev

# With Supabase for full testing
# Configure .env.local, run migrations, then:
npm run dev
```

## 📖 API Documentation

### Quick Start Example
```typescript
import { ToolExecutionService } from '@/services/ToolExecutionService';
import { useToolExecution } from '@/hooks/useToolExecution';

// Using the service directly
const result = await ToolExecutionService.executeTool({
  toolId: 'seo-optimizer',
  userId: 'user-123',
  parameters: { url: 'https://example.com' }
});

// Using React hook
const { executeTool, isExecuting } = useToolExecution();
await executeTool({
  toolId: 'logo-generator',
  userId: user.id,
  parameters: { prompt: 'Modern tech logo' }
});
```

See [TOOL_EXECUTION_GUIDE.md](./TOOL_EXECUTION_GUIDE.md) for complete API reference.

## 🤝 Contributing

1. Check [ROADMAP.md](./src/ROADMAP.md) for upcoming features
2. Review [CHANGELOG.md](./CHANGELOG.md) for recent changes
3. Follow existing code patterns and conventions
4. Add tests for new features
5. Update documentation

## 📝 License

See the original project for licensing information.
  