# Supabase Setup Guide - Google Auth & Database

This guide shows you how to set up Supabase with Google OAuth for Flashcard Maker.

## Why Supabase?

- ✅ Built-in authentication (Google, GitHub, email, etc.)
- ✅ PostgreSQL database (replaces Vercel Postgres)
- ✅ Real-time capabilities
- ✅ Row Level Security for user data
- ✅ Storage for file uploads
- ✅ Free tier: 500MB database, 50,000 monthly active users

## Step 1: Create Supabase Project (5 minutes)

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: flashcard-maker
   - **Database Password**: (generate strong password, save it)
   - **Region**: Choose closest to your users (e.g., West US)
5. Click "Create new project"
6. Wait 2-3 minutes for setup

## Step 2: Get Your API Keys (1 minute)

1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy these values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key
```

⚠️ **Never commit service role key to git!**

## Step 3: Enable Google OAuth (10 minutes)

### A. Get Google OAuth Credentials

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen if prompted:
   - User Type: External
   - App name: Flashcard Maker
   - User support email: your-email@example.com
   - Developer contact: your-email@example.com
   - Save and Continue through all steps
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: Flashcard Maker
   - Authorized JavaScript origins:
     - `https://your-project.supabase.co`
   - Authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
   - Click **Create**
7. Copy **Client ID** and **Client Secret**

### B. Configure in Supabase

1. In Supabase dashboard: **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Enable Google provider
4. Paste your:
   - **Client ID** (from Google Console)
   - **Client Secret** (from Google Console)
5. Click **Save**

### C. Add Your Domain (For Production)

After deploying to production:

1. Go back to Google Console → Your OAuth client
2. Add to **Authorized JavaScript origins**:
   - `https://flashcardmaker.co.uk`
3. Add to **Authorized redirect URIs**:
   - `https://flashcardmaker.co.uk/auth/callback`
   - `https://your-project.supabase.co/auth/v1/callback`
4. Save

## Step 4: Create Database Schema (5 minutes)

### A. Create Tables

1. In Supabase dashboard: **SQL Editor**
2. Click **New query**
3. Run this SQL:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Flashcard decks table
CREATE TABLE public.decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.decks ENABLE ROW LEVEL SECURITY;

-- Users can view their own decks
CREATE POLICY "Users can view own decks"
  ON public.decks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own decks
CREATE POLICY "Users can create own decks"
  ON public.decks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own decks
CREATE POLICY "Users can update own decks"
  ON public.decks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own decks
CREATE POLICY "Users can delete own decks"
  ON public.decks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Flashcards table
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID REFERENCES public.decks(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;

-- Users can view flashcards from their own decks
CREATE POLICY "Users can view own flashcards"
  ON public.flashcards
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = flashcards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Users can create flashcards in their own decks
CREATE POLICY "Users can create own flashcards"
  ON public.flashcards
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.decks
      WHERE decks.id = flashcards.deck_id
      AND decks.user_id = auth.uid()
    )
  );

-- Generation tracking (for rate limiting)
CREATE TABLE public.generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  identifier_hash TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_generations_user_date ON public.generations(user_id, date);
CREATE INDEX idx_generations_hash_date ON public.generations(identifier_hash, date);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

4. Click **Run** to execute

## Step 5: Test Authentication (2 minutes)

1. Run your app locally: `npm run dev`
2. Click "Login / Sign up to Your Flashboard"
3. Click "Continue with Google"
4. Should redirect to Google login
5. After login, should redirect back to homepage
6. You should see your name in the navbar

## Step 6: Update Rate Limiting (Optional)

You can now update the rate limiting to use Supabase instead of Vercel Postgres:

In `lib/rateLimit.ts`, replace:

```typescript
import { sql } from '@vercel/postgres';
```

with:

```typescript
import { createSupabaseServerClient } from './supabase';
```

And update the functions to use Supabase queries instead of Vercel Postgres.

## Environment Variables Summary

Add to `.env.local`:

```bash
# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

## Deployment Checklist

When deploying to Vercel:

1. Add all environment variables in Vercel dashboard
2. Make sure Google OAuth redirect includes your production domain
3. Test login on production site
4. Verify database connection works

## Common Issues

### "Invalid redirect URI"
- Check Google Console has your exact domain
- Include both Supabase callback and your app callback URLs

### "User not found" or auth errors
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure Google provider is enabled in Supabase

### Database connection errors
- Verify all tables were created successfully
- Check Row Level Security policies are active
- Test with Supabase SQL Editor

## Next Steps - Implementing Deck Saving

Once auth is working, you can implement deck saving:

1. Create API route to save decks (`app/api/decks/route.ts`)
2. Update FlashcardGenerator to save to Supabase
3. Create "My Decks" page to view saved decks
4. Implement deck management (edit, delete, share)

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Google OAuth Guide: https://supabase.com/docs/guides/auth/social-login/auth-google

---

**Ready to go!** 🚀 Follow these steps and you'll have Google authentication working in under 20 minutes.
