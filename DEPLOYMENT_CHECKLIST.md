# Deployment Checklist - Flashcard Maker V1

Complete every item before going live. Check off as you go.

## Pre-Deployment Setup

### Code Setup
- [ ] Extract or clone the project repository
- [ ] Run `npm install` in project root
- [ ] Create `.env.local` from `.env.example` template
- [ ] Add `ANTHROPIC_API_KEY` to `.env.local`
- [ ] Verify all TypeScript files compile without errors
- [ ] Test locally: `npm run dev` → visit localhost:3000

### Database Setup (Vercel Postgres)
- [ ] Create Vercel account at vercel.com
- [ ] Create new project, link GitHub repository
- [ ] Go to Storage → Create → Postgres database
- [ ] Copy `POSTGRES_URL` environment variable
- [ ] Open SQL Editor in Vercel Postgres dashboard
- [ ] Run the generations table CREATE statement:
```sql
CREATE TABLE generations (
  id               SERIAL PRIMARY KEY,
  identifier_hash  VARCHAR(64) NOT NULL,
  date             DATE NOT NULL,
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_identifier_date ON generations(identifier_hash, date);
```
- [ ] Verify table created successfully (check Tables tab)

### Static Assets
- [ ] Create `/public/favicon.ico` (32x32px - use circle icon from brand assets)
- [ ] Create `/public/og-image.jpg` (1200x630px - for social sharing)
- [ ] Verify `robots.txt` is in `/public/`
- [ ] Verify sitemap.ts is in `/app/`

## Deployment to Vercel

### Environment Variables
- [ ] Add `ANTHROPIC_API_KEY` to Vercel environment variables (Project Settings → Environment Variables)
- [ ] Verify `POSTGRES_URL` is automatically added by Vercel Postgres
- [ ] (Optional) Add `NEXT_PUBLIC_GA_ID` if using Google Analytics

### Deploy
- [ ] Push code to GitHub main branch
- [ ] Vercel auto-deploys - check build logs for errors
- [ ] Wait for build to complete (typically 2-3 minutes)
- [ ] Visit the Vercel preview URL to test

### Custom Domain
- [ ] Go to Project Settings → Domains in Vercel
- [ ] Add custom domain: `flashcardmaker.co.uk`
- [ ] Update DNS records as directed by Vercel:
  - Add A record pointing to Vercel's IP
  - Or add CNAME record pointing to Vercel
- [ ] Wait for DNS propagation (can take up to 48 hours, usually 5-10 minutes)
- [ ] Wait for SSL certificate (automatic, ~10 mins after DNS propagation)
- [ ] Verify HTTPS works: https://flashcardmaker.co.uk

## Post-Launch Testing

### Functionality Tests
- [ ] Homepage loads correctly with hero section
- [ ] Navigation bar appears with "Login / Sign up to Your Flashboard" button
- [ ] Test file upload:
  - [ ] Click upload zone, select a .txt file
  - [ ] Verify loading screen appears
  - [ ] Verify 30 flashcards generate
  - [ ] Check all 3 views work (Single, Side-by-Side, Grid)
- [ ] Test text paste:
  - [ ] Paste text into textarea
  - [ ] Click "Create Flashcards"
  - [ ] Verify cards generate correctly
- [ ] Test daily limit:
  - [ ] Generate one deck successfully
  - [ ] Refresh page
  - [ ] Try to generate again - should see block message
  - [ ] Verify message: "You've created your free deck for today. Come back tomorrow."
- [ ] Test locked buttons:
  - [ ] Click "💾 Save deck 🔒" button
  - [ ] Verify Flashboard modal opens
  - [ ] Click "⬇️ Download 🔒" button  
  - [ ] Verify Flashboard modal opens
- [ ] Test navigation:
  - [ ] Click "Login / Sign up to Your Flashboard" in nav
  - [ ] Verify modal opens
  - [ ] Click "Not now, continue studying" to close

### Topic Pages
- [ ] Visit /science-flashcards - loads correctly
- [ ] Visit /maths-flashcards - loads correctly
- [ ] Visit /law-flashcards - loads correctly
- [ ] Visit /biology-flashcards - loads correctly
- [ ] Visit /chemistry-flashcards - loads correctly
- [ ] Visit /physics-flashcards - loads correctly
- [ ] Verify each has unique SEO content
- [ ] Test generator works on topic pages

### Mobile Testing
- [ ] Test on iPhone Safari (or iOS simulator)
- [ ] Test on Android Chrome
- [ ] Verify responsive layout works
- [ ] Check touch interactions (tap to flip, drag to scroll)
- [ ] Verify navigation and buttons are tappable
- [ ] Check text is readable at mobile sizes

### Browser Testing
- [ ] Test in Chrome (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Edge (latest)

### SEO & Performance
- [ ] Go to https://search.google.com/search-console
- [ ] Add property: flashcardmaker.co.uk
- [ ] Verify domain ownership (follow Google's instructions)
- [ ] Submit sitemap: https://flashcardmaker.co.uk/sitemap.xml
- [ ] Request indexing for homepage
- [ ] Check robots.txt is accessible: https://flashcardmaker.co.uk/robots.txt
- [ ] Run PageSpeed Insights test
- [ ] Run Lighthouse audit (aim for 90+ scores)

## Critical Verification

### Brand Compliance
- [ ] No mentions of "AI" anywhere in visible UI
- [ ] No mentions of "Generate" (should be "Create")
- [ ] Yellow accent (#ffe75b) only appears on dark backgrounds
- [ ] IBM Plex Mono font loads correctly
- [ ] All buttons use correct brand colors

### Rate Limiting
- [ ] Verify database `generations` table has records after first generation
- [ ] Check that daily limit actually blocks subsequent generations
- [ ] Test that limit resets after midnight UTC (or wait 24 hours to verify)

### Error Handling
- [ ] Test with invalid input (empty text)
- [ ] Test with very long text (>4000 words)
- [ ] Verify appropriate error messages appear
- [ ] Check browser console for any errors

## Monitoring Setup

### Analytics (Optional)
- [ ] Set up Google Analytics if not already done
- [ ] Add GA tracking ID to environment variables
- [ ] Verify events are being tracked

### Error Tracking (Recommended)
- [ ] Consider setting up Sentry or similar
- [ ] Configure error alerts
- [ ] Test error reporting

## Post-Launch Actions

### Immediate
- [ ] Monitor Vercel deployment logs for errors
- [ ] Check Vercel Analytics for traffic
- [ ] Monitor API usage in Anthropic console
- [ ] Watch Postgres database usage in Vercel

### Within First Week
- [ ] Check Google Search Console for indexing status
- [ ] Monitor user feedback/issues
- [ ] Review rate limit effectiveness
- [ ] Check API costs in Anthropic dashboard

### Ongoing
- [ ] Weekly check of Postgres database size
- [ ] Monthly review of API costs
- [ ] Monitor for any rate limit abuse
- [ ] Keep dependencies updated

## Rollback Plan

If something goes wrong:
- [ ] Know how to revert to previous deployment in Vercel (Deployments tab → Three dots → Promote to Production)
- [ ] Have backup of environment variables
- [ ] Know how to quickly disable the API route if needed

---

## Sign-Off

Deployment completed by: ________________

Date: ________________

All checklist items verified: [ ] Yes / [ ] No

Production URL: https://flashcardmaker.co.uk

Notes:
_________________________________________________________
_________________________________________________________
_________________________________________________________
