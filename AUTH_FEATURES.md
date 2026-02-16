# Authentication Features - Google OAuth Implementation

## Overview

The application now includes full Google Authentication via Supabase Auth. Users can sign in with their Google account to unlock additional features.

## What's Been Added

### 1. **Supabase Integration**
- Full Supabase Auth setup with Google OAuth provider
- Authentication context for managing user state across the app
- Session management with automatic token refresh
- Secure callback handling

### 2. **Google Sign-In Flow**
- "Continue with Google" button in Flashboard modal
- Seamless OAuth redirect flow
- Automatic profile creation on first sign-in
- User name/email display in navigation bar

### 3. **Updated Components**

#### NavBar Component
- Shows user's name when logged in
- "Sign Out" button when authenticated
- "Login / Sign up" button when not authenticated

#### FlashboardModal Component
- Google sign-in button with official Google icon
- Different UI for authenticated vs. non-authenticated users
- "Coming Soon" message for authenticated users (deck saving placeholder)

### 4. **Database Schema**
Complete Supabase schema includes:
- **profiles** table - User profile information
- **decks** table - Saved flashcard decks
- **flashcards** table - Individual flashcard contents
- **generations** table - Rate limiting tracking
- Row Level Security (RLS) policies for all tables
- Automatic profile creation trigger

## How It Works

### User Flow

```
1. User clicks "Login / Sign up to Your Flashboard"
   ↓
2. Modal opens with "Continue with Google" button
   ↓
3. User clicks → Redirects to Google OAuth
   ↓
4. User approves → Google redirects to /auth/callback
   ↓
5. Session created → User returned to homepage
   ↓
6. NavBar shows user name + "Sign Out" button
```

### Technical Flow

1. **Client Side** (`components/FlashboardModal.tsx`):
   - User clicks "Continue with Google"
   - `signInWithGoogle()` called from `useAuth()` hook
   - Redirects to Google OAuth consent screen

2. **OAuth Callback** (`app/auth/callback/route.ts`):
   - Google redirects here with authorization code
   - Exchanges code for session tokens
   - Creates session cookie
   - Redirects to homepage

3. **Session Management** (`lib/auth-context.tsx`):
   - AuthProvider wraps entire app
   - Monitors auth state changes
   - Updates user state across all components
   - Handles sign out

4. **Middleware** (`middleware.ts`):
   - Automatically refreshes expired sessions
   - Runs on every request
   - Keeps users logged in seamlessly

## File Structure

```
flashcard-maker-v1.1/
├── lib/
│   ├── supabase.ts              # Supabase client configuration
│   └── auth-context.tsx         # Auth provider & hooks
├── app/
│   ├── layout.tsx               # Wrapped with AuthProvider
│   └── auth/
│       └── callback/
│           └── route.ts         # OAuth callback handler
├── components/
│   ├── NavBar.tsx               # Shows user state
│   └── FlashboardModal.tsx      # Google sign-in UI
└── middleware.ts                # Session refresh
```

## Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Anthropic (existing)
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

## Setup Instructions

See `SUPABASE_SETUP.md` for complete step-by-step instructions including:
1. Creating Supabase project
2. Configuring Google OAuth
3. Setting up database schema
4. Testing authentication
5. Deploying to production

## What Users Get

### Free Users (Not Signed In)
- ✅ 1 free deck per day
- ✅ All 3 study modes
- ✅ File upload & text paste
- ❌ Cannot save decks
- ❌ Cannot download decks

### Authenticated Users (Signed In)
- ✅ 1 free deck per day (same as free)
- ✅ All 3 study modes
- ✅ File upload & text paste
- 🔜 Deck saving (coming in V2)
- 🔜 Deck downloading (coming in V2)
- 🔜 Increased daily limits (coming in V2)

## Future Features (V2)

Once authentication is working, these features can be implemented:

### 1. **Deck Saving**
```typescript
// API route: app/api/decks/save/route.ts
POST /api/decks/save
Body: { title, description, flashcards }
→ Saves to Supabase decks + flashcards tables
```

### 2. **My Decks Page**
```typescript
// Page: app/my-decks/page.tsx
→ Fetch user's saved decks from Supabase
→ Display deck grid with titles
→ Click to load and study
```

### 3. **Deck Management**
- Edit deck titles/descriptions
- Delete decks
- Duplicate decks
- Share deck links (public URLs)

### 4. **Enhanced Limits**
```typescript
// Check user_id in generations table
// Authenticated users: 3 decks/day
// Free users: 1 deck/day
```

### 5. **Download Formats**
- PDF export
- CSV export
- Anki-compatible .apkg format

## Testing Authentication

### Local Testing

1. Start dev server: `npm run dev`
2. Click "Login / Sign up to Your Flashboard"
3. Click "Continue with Google"
4. Sign in with Google account
5. Should redirect back to homepage
6. Check navbar shows your name

### Production Testing

1. Deploy to Vercel
2. Add production domain to Google OAuth
3. Test sign-in flow
4. Verify session persists across page refreshes
5. Test sign out

## Security Features

### Row Level Security (RLS)
All database tables have RLS policies:
- Users can only view/edit their own data
- Profiles, decks, flashcards all protected
- SQL injection prevention built-in

### Session Security
- HTTP-only cookies
- Automatic token refresh
- Secure session storage
- PKCE flow for OAuth

### API Security
- Service role key never exposed to client
- Anon key safe for public use
- User ID from authenticated session only

## Common Issues

### "Invalid redirect URI"
**Problem**: Google OAuth fails with redirect error
**Solution**: Add exact domain to Google Console authorized URIs

### User not appearing in navbar
**Problem**: Sign-in works but name doesn't show
**Solution**: Check `user_metadata` is being saved (may need to update Google OAuth scopes)

### Session expires too quickly
**Problem**: User gets logged out unexpectedly  
**Solution**: Middleware should be refreshing tokens automatically - check middleware.ts is running

### Database permission errors
**Problem**: RLS policies blocking access
**Solution**: Verify policies use `auth.uid()` correctly and tables have ENABLE ROW LEVEL SECURITY

## API Usage Examples

### Get Current User

```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user } = useAuth();
  
  if (user) {
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Name:', user.user_metadata.full_name);
  }
}
```

### Protected API Route

```typescript
// app/api/my-route/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const userId = session.user.id;
  // ... rest of your logic
}
```

### Save User Data

```typescript
import { createSupabaseClient } from '@/lib/supabase';

const supabase = createSupabaseClient();

// Save a deck
const { data, error } = await supabase
  .from('decks')
  .insert({
    title: 'My Biology Deck',
    description: 'Cell biology flashcards',
  })
  .select()
  .single();

// Fetch user's decks
const { data: decks } = await supabase
  .from('decks')
  .select('*')
  .order('created_at', { ascending: false });
```

## Migration Path

If you prefer to keep Vercel Postgres instead of Supabase:

1. **Keep Supabase for auth only** - Don't use Supabase database
2. **Use Vercel Postgres for data** - Keep existing schema
3. **Store user_id from Supabase** - Add to Vercel Postgres tables
4. **Simpler setup** - Fewer moving parts

Both approaches work - Supabase is recommended for simpler all-in-one solution.

## Support

- **Supabase Docs**: https://supabase.com/docs/guides/auth
- **Google OAuth**: https://supabase.com/docs/guides/auth/social-login/auth-google
- **Next.js Integration**: https://supabase.com/docs/guides/auth/auth-helpers/nextjs

---

**Authentication is ready to use!** Follow SUPABASE_SETUP.md to get it working in 20 minutes.
