# Flashcard Maker - Quick Start Guide

## What You Have

The complete Next.js production application for Flashcard Maker, ready to deploy.

## Immediate Next Steps

### 1. Extract and Install (5 minutes)

```bash
# Extract the project
tar -xzf flashcard-maker-v1.1-complete.tar.gz
cd flashcard-maker-v1.1

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Add Your API Key (2 minutes)

Edit `.env.local` and add:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key from: https://console.anthropic.com/

### 3. Test Locally (2 minutes)

```bash
npm run dev
```

Open http://localhost:3000

Try:
- Upload a text file or paste some text
- Click "Create Flashcards"
- Test all 3 view modes (Single, Side-by-Side, Grid)
- Click the locked buttons to see the modal

### 4. Deploy to Vercel (15 minutes)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/flashcard-maker.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variable: `ANTHROPIC_API_KEY`
   - Click Deploy

3. **Setup Database**
   - In Vercel dashboard: Storage → Create → Postgres
   - Go to SQL Editor
   - Run this:
   ```sql
   CREATE TABLE generations (
     id SERIAL PRIMARY KEY,
     identifier_hash VARCHAR(64) NOT NULL,
     date DATE NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   CREATE INDEX idx_identifier_date ON generations(identifier_hash, date);
   ```

4. **Add Domain**
   - Project Settings → Domains
   - Add `flashcardmaker.co.uk`
   - Update DNS as instructed

## What's Included

✅ All 7 pages (home + 6 topic pages)
✅ Full flashcard generation with Claude API
✅ 3 study modes (Single, Side-by-Side, Grid)
✅ Rate limiting (1 deck/day)
✅ File upload & text paste
✅ Flashboard modal (placeholder)
✅ Complete brand styling (IBM Plex Mono, brand colors)
✅ SEO optimized (sitemap, metadata)
✅ Mobile responsive

## Important Reminders

🚫 **NO AI mentions anywhere** - this is critical for the brand
⚡ Use "Create" not "Generate" in all UI text
🎨 Yellow (#ffe75b) ONLY on dark backgrounds
📝 IBM Plex Mono font throughout

## File Structure

```
flashcard-maker-v1.1/
├── app/
│   ├── page.tsx                      # Homepage
│   ├── layout.tsx                    # Root layout
│   ├── api/generate/route.ts         # Flashcard generation API
│   ├── science-flashcards/page.tsx   # Topic pages
│   ├── maths-flashcards/page.tsx
│   ├── law-flashcards/page.tsx
│   ├── biology-flashcards/page.tsx
│   ├── chemistry-flashcards/page.tsx
│   └── physics-flashcards/page.tsx
├── components/
│   ├── NavBar.tsx                    # Navigation
│   ├── Header.tsx                    # Hero section
│   ├── FlashcardGenerator.tsx        # Main component
│   ├── InputSection.tsx              # Upload/paste
│   ├── SingleView.tsx                # Flip cards
│   ├── SideBySideView.tsx            # Q&A columns
│   ├── GridView.tsx                  # Card grid
│   └── FlashboardModal.tsx           # Signup modal
└── lib/
    ├── types.ts                       # TypeScript types
    └── rateLimit.ts                   # Rate limiting logic
```

## Testing Checklist

Before going live, test:

- [ ] Homepage loads
- [ ] File upload works
- [ ] Text paste works
- [ ] All 3 view modes work
- [ ] Rate limit blocks 2nd generation
- [ ] Locked buttons open modal
- [ ] All 6 topic pages load
- [ ] Mobile responsive
- [ ] SSL certificate active

## Support

Refer to:
- `README.md` - Full documentation
- `DEPLOYMENT_CHECKLIST.md` - Complete deployment steps
- Project report (flashcard-maker-report.docx) - Full project details

## Need Help?

Common issues:
- **"Module not found"** → Run `npm install`
- **Rate limit not working** → Check database table exists
- **API errors** → Verify ANTHROPIC_API_KEY is set
- **Build errors** → Check all imports are correct

---

You're ready to deploy! 🚀

The app is production-ready. Just add your API key, deploy to Vercel, setup the database, and you're live.
