import Link from 'next/link';
import { getDecksBySubject } from '@/lib/library';

export default function DashboardLibraryPage() {
  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="dashboard-page-title">Free Library</h1>
        <p className="dashboard-page-subtitle">Browse pre-made sets — click any deck to study it, or save it to your Flashboard.</p>
      </div>
      <div className="dashboard-library-grid">
        {Object.entries(getDecksBySubject()).map(([subject, decks]) => (
          <div key={subject} className="library-subject-group">
            <div className="library-subject-heading">{subject}</div>
            {decks.map(deck => (
              <Link key={deck.slug} href={`/library/${deck.slug}?from=dashboard`} className="library-directory-row">
                <span className="library-row-title">{deck.title}</span>
                <span className="library-row-count">{deck.cards.length} cards</span>
                <span className="library-row-arrow">→</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
