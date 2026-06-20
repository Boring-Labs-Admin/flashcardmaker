import Link from 'next/link';
import { Check } from 'lucide-react';
import HomePageClient from '@/components/HomePageClient';
import StatsBand from '@/components/StatsBand';
import PricingCards from '@/components/PricingCards';
import ScrollReveal from '@/components/ScrollReveal';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { getDecksBySubject, LIBRARY_DECKS } from '@/lib/library';

const decksBySubject = getDecksBySubject();
const deckCountBySubject: Record<string, number> = {};
for (const deck of LIBRARY_DECKS) {
  deckCountBySubject[deck.subject] = (deckCountBySubject[deck.subject] ?? 0) + 1;
}

export default function HomeContent() {
  return (
    <main>
      {/* Interactive section — NavBar, Header, FlashcardGenerator, login modal */}
      <HomePageClient />

      {/* Honest, live-computed stats — no invented numbers */}
      <StatsBand />

      {/* Static content — server-rendered for Google */}
      <div className="container">

        <ScrollReveal>
          <div className="subject-section" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Built to revise with</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>One deck, three ways to study</h2>
            <p className="section-subtitle">Different topics stick in different ways. Flip cards to test recall, scan a list to revise fast, or run a quiz to find the gaps.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: 480, margin: '0 auto', fontFamily: 'var(--sans)', fontSize: '0.95rem', textAlign: 'left' }}>
              {[
                'Flip cards one at a time to test recall',
                'Scan the whole deck as a list to revise fast',
                'Run a multiple-choice quiz to find the gaps',
              ].map(f => (
                <li key={f} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Check size={18} strokeWidth={2.5} color="var(--cobalt-blue)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />{f}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="subject-section" style={{ textAlign: 'center' }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Works with anything</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Whatever your notes look like, we read them</h2>
            <p className="section-subtitle">Lecture slides, scanned PDFs, photos of a textbook page, even equations — drop them in and get a deck back.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: 480, margin: '0 auto', fontFamily: 'var(--sans)', fontSize: '0.95rem', textAlign: 'left' }}>
              {[
                'PDFs, Word documents and plain text',
                'Photos of handwritten or printed notes',
                'Maths and science notation, rendered properly',
              ].map(f => (
                <li key={f} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <Check size={18} strokeWidth={2.5} color="var(--cobalt-blue)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />{f}
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>

        <div className="subject-section" id="subjects">
          <h2 className="section-title">Flashcards by Subject</h2>
          <p className="section-subtitle">Pick a subject and upload your notes — your deck is ready in seconds</p>
          <div className="subject-grid">
            {SUBJECTS.map((s) => (
              <Link key={s.href} href={s.href} className="subject-card">
                <div className="subject-icon"><s.icon size={32} strokeWidth={1.75} /></div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.name}</h3>
                {deckCountBySubject[s.name.replace(' Flashcards', '')] > 0 && (
                  <p style={{ fontSize: '0.8rem', fontFamily: 'var(--sans)', opacity: 0.65, marginTop: '0.35rem' }}>
                    {deckCountBySubject[s.name.replace(' Flashcards', '')]} free decks
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="subject-section">
          <h2 className="section-title">Flashcards by Curriculum</h2>
          <p className="section-subtitle">Find flashcards tailored to your exam board or qualification</p>
          <div className="subject-grid">
            {CURRICULA.map((c) => (
              <Link key={c.href} href={c.href} className="subject-card">
                <div className="subject-icon"><c.icon size={32} strokeWidth={1.75} /></div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>

        <div className="subject-section" id="free-flashcards">
          <h2 className="section-title">Free Flashcard Library</h2>
          <p className="section-subtitle">Browse pre-made flashcard sets — no account needed to get started</p>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Link href="/library" className="btn-outline">
              View full library →
            </Link>
          </div>
          <div className="library-directory">
            {Object.entries(decksBySubject).map(([subject, decks]) => (
              <div key={subject} className="library-subject-group">
                <div className="library-subject-heading">{subject}</div>
                {decks.slice(0, 3).map(deck => (
                  <Link key={deck.slug} href={`/library/${deck.slug}`} className="library-directory-row">
                    <span className="library-row-title">{deck.title}</span>
                    <span className="library-row-count">{deck.cards.length} cards</span>
                    <span className="library-row-arrow">→</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/library" className="btn-outline">
              View full library →
            </Link>
          </div>
        </div>

        <div className="subject-section" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Pricing</div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>Start free. Upgrade when you need more.</h2>
          <p className="section-subtitle">One free deck a day, no account needed. Go Plus when you want unlimited.</p>
          <PricingCards />
        </div>

        <div className="subject-section">
          <div className="final-cta">
            <h2>Your next revision deck is two seconds away.</h2>
            <p>Paste your notes, upload a PDF, or pick a topic — and start studying. No sign-up to try your first one.</p>
            <div className="final-cta-actions">
              <Link href="/#generator" className="btn-cta-light">Make my flashcards</Link>
              <Link href="/library" className="btn-cta-ghost">Browse the free library</Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
