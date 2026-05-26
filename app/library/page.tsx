import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { getDecksBySubject } from '@/lib/library';
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

export default function LibraryIndexPage() {
  return (
    <main>
      <NavBar />
      <div className="container">
        <div className="subject-section">
          <h1 className="section-title">Free Flashcard Library</h1>
          <p className="section-subtitle">Browse pre-made flashcard sets — no account needed to get started</p>
          <div className="library-directory">
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
      </div>
    </main>
  );
}
