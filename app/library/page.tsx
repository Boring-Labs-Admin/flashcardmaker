import Link from 'next/link';
import { Library as LibraryIcon } from 'lucide-react';
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

export default function LibraryIndexPage() {
  return (
    <main>
      <NavBar />

      <section className="header" style={{ textAlign: 'center' }}>
        <div className="header-content">
          <div className="pill" style={{ margin: '0 auto 1.25rem' }}><LibraryIcon size={13} /> {deckCount}+ decks · {subjectCount}+ subjects</div>
          <h1 className="header-title">Free flashcard library</h1>
          <p className="header-description" style={{ margin: '0 auto 1.5rem' }}>Ready-made decks written for the UK curriculum. Preview the first 10 cards of any deck with no account — or make your own from notes.</p>
          <Link href="/" className="header-library-btn">Or make your own deck →</Link>
        </div>
      </section>

      <div className="container">
        <div className="subject-section">
          <div className="library-directory library-directory-wide">
            {Object.entries(decksBySubject).map(([subject, decks]) => (
              <div key={subject} className="library-subject-group">
                <div className="library-subject-heading">{subject}</div>
                {decks.map(deck => (
                  <Link key={deck.slug} href={`/library/${deck.slug}`} className="library-directory-row">
                    <span className="library-row-title">{deck.title}</span>
                    <span className="library-row-count">{deck.cards.length} cards</span>
                    <span className="library-row-arrow">→</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="subject-section">
          <div className="final-cta">
            <h2>Can&apos;t find your exact topic?</h2>
            <p>Make a deck from your own notes in seconds — your first one&apos;s free, no account needed.</p>
            <div className="final-cta-actions">
              <Link href="/#generator" className="btn-cta-light">Make my own deck</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
