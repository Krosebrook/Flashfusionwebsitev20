# API / Interoperability Reference

**Version:** 2.1.0 | **Last Updated:** 2026-03-08 | **Audience:** Developers

---

## Table of Contents

1. [Overview](#1-overview)
2. [Supabase REST API](#2-supabase-rest-api)
3. [Authentication Endpoints](#3-authentication-endpoints)
4. [Database Queries (Supabase JS)](#4-database-queries-supabase-js)
5. [Edge Functions](#5-edge-functions)
6. [Realtime Subscriptions](#6-realtime-subscriptions)
7. [Third-Party Integrations](#7-third-party-integrations)
8. [Error Handling](#8-error-handling)
9. [Rate Limiting](#9-rate-limiting)

---

## 1. Overview

FlashFusion uses **Supabase** as its primary backend. There is no custom-built REST API server; all data access is through:

1. **Supabase JS client** — type-safe direct database queries with RLS enforcement
2. **Supabase Auth** — authentication and session management
3. **Supabase Edge Functions** — custom server-side logic (Hono framework, Deno runtime)
4. **Supabase Realtime** — live database subscriptions

### Base URLs

| Environment | Supabase URL Pattern |
|---|---|
| Development | `https://<project-id>.supabase.co` |
| Production | `https://<prod-project-id>.supabase.co` |

### Authentication Header

All API requests require the `Authorization` header with a valid JWT:

```http
Authorization: Bearer <user-jwt-token>
apikey: <supabase-anon-key>
```

The Supabase JS client handles this automatically when the user is authenticated.

---

## 2. Supabase REST API

Supabase auto-generates a RESTful API from the PostgreSQL schema via PostgREST.

### Base endpoint

```
GET/POST/PATCH/DELETE https://<project-id>.supabase.co/rest/v1/<table>
```

### Common Query Parameters

| Parameter | Description | Example |
|---|---|---|
| `select` | Choose columns | `?select=id,name,created_at` |
| `order` | Sort results | `?order=created_at.desc` |
| `limit` | Limit rows | `?limit=20` |
| `offset` | Pagination offset | `?offset=40` |
| `eq` | Filter equality | `?status=eq.active` |
| `like` | Pattern match | `?name=like.*fusion*` |

### Example — Get user projects

```bash
curl 'https://<project-id>.supabase.co/rest/v1/user_projects?select=id,name,created_at&order=created_at.desc&limit=10' \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <user-jwt>"
```

---

## 3. Authentication Endpoints

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    emailRedirectTo: 'https://flashfusion.dev/auth/callback',
  },
});
```

**Response (success):**
```json
{
  "user": { "id": "uuid", "email": "user@example.com", ... },
  "session": null  // null until email confirmed
}
```

### Sign In with Password

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123',
});
```

### Sign In with OAuth

```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: 'https://flashfusion.dev/auth/callback',
    scopes: 'read:user user:email',
  },
});
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut();
```

### Get Current User

```typescript
const { data: { user }, error } = await supabase.auth.getUser();
```

### Session Events

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  // event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED'
  console.log(event, session);
});
```

---

## 4. Database Queries (Supabase JS)

All queries are executed through the typed Supabase JS client.

### Select (Read)

```typescript
// Get all projects for current user
const { data, error } = await supabase
  .from('user_projects')
  .select('id, name, description, created_at, status')
  .order('created_at', { ascending: false })
  .limit(20);
```

### Insert (Create)

```typescript
const { data, error } = await supabase
  .from('user_projects')
  .insert({
    name: 'My New Project',
    description: 'A great project',
    user_id: userId,
  })
  .select()
  .single();
```

### Update

```typescript
const { data, error } = await supabase
  .from('user_projects')
  .update({ status: 'published', updated_at: new Date().toISOString() })
  .eq('id', projectId)
  .select()
  .single();
```

### Delete

```typescript
const { error } = await supabase
  .from('user_projects')
  .delete()
  .eq('id', projectId);
```

### Full-Text Search

```typescript
const { data, error } = await supabase
  .from('user_projects')
  .select()
  .textSearch('name', query, { type: 'websearch' });
```

---

## 5. Edge Functions

Edge Functions provide custom server-side logic without exposing secrets to the client.

### Base URL

```
POST https://<project-id>.supabase.co/functions/v1/<function-name>
```

### Calling an Edge Function

```typescript
const { data, error } = await supabase.functions.invoke('generate-content', {
  body: {
    prompt: 'Write a blog post about React hooks',
    tone: 'professional',
    length: 'medium',
  },
});
```

### Example Edge Function (Hono)

```typescript
// supabase/functions/generate-content/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors());

app.post('/', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) return c.json({ error: 'Unauthorised' }, 401);

  const { prompt, tone } = await c.req.json();

  // Call AI API with server-side key (not exposed to client)
  // const result = await callOpenAI(prompt, tone);

  return c.json({ content: 'Generated content here' });
});

export default app;
```

---

## 6. Realtime Subscriptions

### Subscribe to Table Changes

```typescript
const channel = supabase
  .channel('project-changes')
  .on(
    'postgres_changes',
    {
      event: '*',            // INSERT | UPDATE | DELETE | *
      schema: 'public',
      table: 'user_projects',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Change received:', payload);
    }
  )
  .subscribe();

// Cleanup on unmount
return () => supabase.removeChannel(channel);
```

### Subscribe to Broadcast Messages

```typescript
const channel = supabase.channel('room:123');
channel
  .on('broadcast', { event: 'cursor-update' }, (payload) => {
    updateCursor(payload);
  })
  .subscribe();

// Send a broadcast
channel.send({
  type: 'broadcast',
  event: 'cursor-update',
  payload: { x: 100, y: 200 },
});
```

---

## 7. Third-Party Integrations

### GitHub API

Used for repository management features (planned).

```typescript
// Via Supabase Edge Function (server-side)
const response = await fetch('https://api.github.com/user/repos', {
  headers: {
    Authorization: `Bearer ${Deno.env.get('GITHUB_TOKEN')}`,
    Accept: 'application/vnd.github.v3+json',
  },
});
```

### OpenAI API (Planned)

```typescript
// Via Supabase Edge Function — key never exposed client-side
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  }),
});
```

---

## 8. Error Handling

### Supabase JS Error Pattern

```typescript
const { data, error } = await supabase.from('table').select();
if (error) {
  // error.message   — human-readable message
  // error.code      — PostgreSQL error code
  // error.details   — additional context
  // error.hint      — suggested fix
  throw new Error(`Database error: ${error.message}`);
}
```

### Common Error Codes

| Code | Meaning | Common Cause |
|---|---|---|
| `PGRST116` | No rows found | `.single()` with no matching row |
| `42501` | Insufficient privilege | RLS policy blocking access |
| `23503` | Foreign key violation | Inserting row with invalid reference |
| `23505` | Unique violation | Duplicate value in unique column |
| `JWT expired` | Auth token expired | Session not refreshed |

---

## 9. Rate Limiting

### Supabase Limits (Free Plan)

| Resource | Limit |
|---|---|
| Database size | 500 MB |
| Bandwidth | 5 GB / month |
| Edge Function invocations | 500K / month |
| Realtime connections | 200 concurrent |
| Auth users | Unlimited |
| API requests | 60 req/min per IP (PostgREST) |

### Handling Rate Limit Errors

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

---

*Last Updated: 2026-03-08 | Owner: Engineering*
