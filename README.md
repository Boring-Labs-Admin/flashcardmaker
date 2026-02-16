# Flashcard Maker - Production Application

This is the complete Next.js production application for Flashcard Maker (flashcardmaker.co.uk).

## Overview

Flashcard Maker is a free, utility-first web application that converts documents, notes, photos, and pasted text into study flashcards instantly. The product is framed around speed and ease of use - **no AI mentions anywhere in the UI or copy**.

## Key Features

- **1 Free Deck Per Day** - Daily generation limit, resets at midnight UTC
- **30 Cards Per Generation** - Hard cap enforced client and server-side
- **No Account Required** - Lowest friction entry, account upsell happens after value demonstration
- **3 Study Modes** - Single flip view, side-by-side view, and grid view
- **Multiple Input Methods** - File upload (PDF, DOCX, TXT, images) or text paste

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Generation**: Anthropic Claude API (claude-sonnet-4-20250514)
- **Database**: Vercel Postgres
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Anthropic API key (from console.anthropic.com)
- Vercel account (for Postgres database)

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Create `.env.local` from `.env.example`:
```bash
cp .env.example .env.local
```

3. Add your environment variables to `.env.local`:
```
ANTHROPIC_API_KEY=your-api-key-here
POSTGRES_URL=your-postgres-connection-string
```

4. Run development server:
```bash
npm run dev
```

5. Open http://localhost:3000

## Database Setup

Before deploying, you need to create the database table:

1. Go to your Vercel project → Storage → Create Postgres database
2. Open SQL Editor
3. Run this SQL:

```sql
CREATE TABLE generations (
  id               SERIAL PRIMARY KEY,
  identifier_hash  VARCHAR(64) NOT NULL,
  date             DATE NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_identifier_date ON generations(identifier_hash, date);
```

## Brand Guidelines

### Colors
- **Cobalt Blue** (#004aad) - Primary color
- **Dark Blue** (#00326b) - Gradient partner
- **Yellow Bolt** (#ffe75b) - Accent (ONLY on dark backgrounds)
- **Light Blue** (#e6f0ff) - Card backgrounds

### Typography
- **Font**: IBM Plex Mono
- All weights (100-700) loaded via Google Fonts

### Critical Rules
- ❌ Never mention "AI", "artificial intelligence", "machine learning", "AI-powered"
- ❌ Never use "Generate" - use "Create" instead
- ✅ Use "Turn your documents into flashcards instantly"
- ✅ Use "Reading your content and building your deck" (loading text)

## Project Structure

```
flashcard-maker-v1.1/
├── app/
│   ├── layout.tsx                 # Root layout + SEO metadata
│   ├── page.tsx                   # Homepage
│   ├── globals.css                # Brand colors + IBM Plex Mono
│   ├── api/generate/route.ts      # POST endpoint for flashcard generation
│   ├── science-flashcards/        # Science topic page
│   ├── maths-flashcards/          # Maths topic page
│   ├── law-flashcards/            # Law topic page
│   ├── biology-flashcards/        # Biology topic page
│   ├── chemistry-flashcards/      # Chemistry topic page
│   └── physics-flashcards/        # Physics topic page
├── components/
│   ├── NavBar.tsx                 # Navigation with login button
│   ├── Header.tsx                 # Hero section with logo
│   ├── FlashcardGenerator.tsx     # Main state orchestrator
│   ├── InputSection.tsx           # File upload + text input
│   ├── SingleView.tsx             # Flip card with navigation
│   ├── SideBySideView.tsx         # Q+A columns
│   ├── GridView.tsx               # 3-column flip grid
│   ├── ViewToggle.tsx             # View mode switcher
│   └── FlashboardModal.tsx        # Account signup modal (V2)
├── lib/
│   ├── types.ts                   # TypeScript interfaces
│   └── rateLimit.ts               # Rate limiting + validation
└── public/                        # Static assets (add your own)
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `POSTGRES_URL` (auto-added when you create Postgres storage)
4. Deploy
5. Add custom domain: flashcardmaker.co.uk

### Post-Deployment Checklist

- [ ] Verify homepage loads
- [ ] Test file upload generation
- [ ] Test text paste generation
- [ ] Verify daily limit works
- [ ] Test all 3 view modes
- [ ] Test locked buttons open modal
- [ ] Test all 6 topic pages
- [ ] Check mobile responsiveness
- [ ] Submit sitemap to Google Search Console

## Rate Limiting

Three-layer system:

1. **Client-side**: localStorage timestamp check (fast, prevents unnecessary API calls)
2. **Server-side**: IP address hash (cannot be bypassed by clearing localStorage)
3. **Database**: Postgres generations table (permanent record)

Block message: "You've created your free deck for today. Come back tomorrow."

## Development Notes

### What's Included in V1
- Homepage with flashcard generator
- 6 topic pages (Science, Maths, Law, Biology, Chemistry, Physics)
- File upload and text paste
- 3 viewing modes
- Daily rate limiting
- Flashboard modal (placeholder only)

### What's NOT in V1 (Future)
- User accounts (Flashboard)
- Deck saving/downloading
- Increased limits for registered users
- Spaced repetition
- Deck editing
- Shared decks

## Support

For issues or questions about the codebase, refer to the project handover report.

---

Built with ⚡ by Claude
Version 1.1 - February 2026
