import Link from 'next/link';
import { Library as LibraryIcon, Zap } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { LIBRARY_DECKS, getDecksBySubject } from '@/lib/library';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Flashcard Library | Flashcard Maker',
  description: 'Browse hundreds of free pre-made flashcard sets across Biology, Chemistry, History, Psychology and more. No account needed — start studying instantly.',
  alternates: {
    canonical: 'https://flashcardmaker.co.uk/library',
  },
  openGraph: {
    title: 'Free Flashcard Library | Flashcard Maker',
    description: 'Browse hundreds of free pre-made flashcard sets across Biology, Chemistry, History, Psychology and more. No account needed — start studying instantly.',
    url: 'https://flashcardmaker.co.uk/library',
  },
};

const decksBySubject = getDecksBySubject();
const deckCount = LIBRARY_DECKS.length;
const subjectCount = Object.keys(decksBySubject).length;

// Subjects that have their own dedicated landing page get a "See all {Subject} →" link
const SUBJECT_PAGE_SLUGS: Record<string, string> = {
  Biology: 'biology', Chemistry: 'chemistry', Physics: 'physics',
  Maths: 'maths', Psychology: 'psychology', Medicine: 'medical',
  Anatomy: 'anatomy', Nursing: 'nursing', History: 'history',
  Geography: 'geography', Economics: 'business', 'Business Studies': 'business',
};

export default function LibraryIndexPage() {
  return (
    <main>
      <NavBar />

      <section className="header" style={{ textAlign: 'center' }}>
        <div className="header-content">
          <div className="pill" style={{ margin: '0 auto 1.25rem' }}><LibraryIcon size={13} /> {deckCount}+ decks · {subjectCount}+ subjects</div>
          <h1 className="header-title">Free flashcard library</h1>
          <p className="header-description" style={{ margin: '0 auto 1.5rem' }}>Ready-made decks written for the UK curriculum. Preview the first 10 cards of any deck with no account — or make your own from notes.</p>
          <Link href="/#generator" className="header-library-btn">Or make your own deck →</Link>
        </div>
      </section>

      <div className="container">
        <div className="subject-section" style={{ paddingTop: '1rem' }}>
          <div className="lib-grid lib-grid-wide">
            {Object.entries(decksBySubject).map(([subject, decks]) => {
              const slug = SUBJECT_PAGE_SLUGS[subject];
              return (
                <div key={subject} className="lib-col">
                  <h4>{subject}</h4>
                  <ul>
                    {decks.map(deck => (
                      <li key={deck.slug}>
                        <Link href={`/library/${deck.slug}`}>
                          <span className="nm">{deck.title}</span>
                          <span className="ct">{deck.cards.length} cards →</span>
                        </Link>
                      </li>
                    ))}
                    {slug && (
                      <li>
                        <Link href={`/${slug}-flashcards`}>
                          <span className="nm" style={{ color: 'var(--cobalt-blue)', fontWeight: 700 }}>See all {subject} →</span>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="subject-section">
          <div className="final-cta">
            <h2>Can&apos;t find your exact topic?</h2>
            <p>Make a deck from your own notes in seconds — your first one&apos;s free, no account needed.</p>
            <div className="final-cta-actions">
              <Link href="/#generator" className="btn-cta-light"><Zap size={16} /> Make my own deck</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
