import Link from 'next/link';
import HomePageClient from '@/components/HomePageClient';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { getDecksBySubject } from '@/lib/library';

const decksBySubject = getDecksBySubject();

export default function HomeContent() {
  return (
    <main>
      {/* Interactive section — NavBar, Header, FlashcardGenerator, login modal */}
      <HomePageClient />

      {/* Static content — server-rendered for Google */}
      <div className="container">

        {/* Features / pricing tier overview */}
        <div className="subject-section">
          <h2 className="section-title">Study smarter, at every level</h2>
          <p className="section-subtitle">Start free in seconds. Upgrade whenever you need more.</p>
          <div className="features">

            {/* No account */}
            <div className="feature">
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>No account needed</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cobalt-blue)', marginBottom: '0.2rem' }}>Free</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.25rem' }}>No sign-up, no card</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {[
                  'Generate flashcards from notes, PDFs & images',
                  'Browse 90+ pre-made free flashcard decks',
                  'Flip, list & test study modes',
                  '1 generation per day',
                ].map((f) => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--cobalt-blue)', flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Free account */}
            <div className="feature">
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Free account</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--cobalt-blue)', marginBottom: '0.2rem' }}>£0</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.6, marginBottom: '1.25rem' }}>No card required</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                {[
                  'Everything above',
                  'Daily credits that bank up to 5',
                  '30 cards per deck',
                  'Save decks to your Flashboard',
                  'Download decks as PDF',
                ].map((f) => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--cobalt-blue)', flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="btn-outline" style={{ display: 'block', textAlign: 'center' }}>
                Sign up free →
              </Link>
            </div>

            {/* Plus */}
            <div className="feature" style={{ background: 'var(--cobalt-blue)', color: 'white', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: '#F5C518', color: 'var(--cobalt-blue)', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', padding: '0.2rem 0.75rem', borderRadius: 20, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Most popular
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase', marginBottom: '0.5rem' }}>⚡ Plus</div>
              <div style={{ marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 800 }}>£4.99</span>
                <span style={{ opacity: 0.7, fontSize: '0.9rem' }}>/month</span>
              </div>
              <div style={{ fontSize: '0.82rem', opacity: 0.65, marginBottom: '1.25rem' }}>or £39/year — save 35%</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.55rem', marginBottom: '1.5rem' }}>
                {[
                  'Everything in Free account',
                  'Unlimited generations',
                  '60 cards per deck',
                  'Generate from any topic with AI',
                  '100,000 character input',
                  'Up to 20 files per generation',
                  'Priority processing speed',
                ].map((f) => (
                  <li key={f} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ color: '#F5C518', flexShrink: 0 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" style={{ display: 'block', textAlign: 'center', background: 'white', color: 'var(--cobalt-blue)', border: '2px solid white', borderRadius: 8, padding: '0.65rem 1.25rem', fontWeight: 700, fontSize: '0.875rem', fontFamily: '"IBM Plex Mono", monospace' }}>
                Get Plus →
              </Link>
            </div>

          </div>
        </div>

        <div className="subject-section">
          <h2 className="section-title">Flashcards by Subject</h2>
          <p className="section-subtitle">Pick a subject and upload your notes — your deck is ready in seconds</p>
          <div className="subject-grid">
            {SUBJECTS.map((s) => (
              <Link key={s.href} href={s.href} className="subject-card">
                <div className="subject-icon">{s.icon}</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.name}</h3>
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
                <div className="subject-icon">{c.icon}</div>
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
      </div>
    </main>
  );
}
