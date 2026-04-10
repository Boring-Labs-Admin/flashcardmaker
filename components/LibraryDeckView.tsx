'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import LatexRenderer from '@/components/LatexRenderer';
import FlashboardModal from '@/components/FlashboardModal';
import type { LibraryDeck } from '@/lib/library';

const FREE_LIMIT = 10;

export default function LibraryDeckView({ deck }: { deck: LibraryDeck }) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});

  const visibleCards = user ? deck.cards : deck.cards.slice(0, FREE_LIMIT);
  const hasGate = !user && deck.cards.length > FREE_LIMIT;

  const toggleFlip = (i: number) =>
    setFlipped(f => ({ ...f, [i]: !f[i] }));

  return (
    <div className="container">
      <div className="library-deck-header">
        <Link href="/#library" className="back-link">← Library</Link>
        <h1 className="library-deck-title">{deck.title}</h1>
        <p className="library-deck-meta">{deck.cards.length} cards · {deck.subject}</p>
      </div>

      <div className="library-card-list">
        {visibleCards.map((card, i) => (
          <div
            key={i}
            className="library-card"
            onClick={() => toggleFlip(i)}
          >
            <div className="library-card-num">{i + 1}</div>
            <div className="library-card-content">
              {flipped[i] ? (
                <>
                  <span className="library-card-label">Answer</span>
                  <LatexRenderer text={card.answer} />
                </>
              ) : (
                <>
                  <span className="library-card-label">Question</span>
                  <LatexRenderer text={card.question} />
                </>
              )}
            </div>
            <div className="library-card-flip">{flipped[i] ? 'Show Q' : 'Show A'}</div>
          </div>
        ))}
      </div>

      {hasGate && (
        <div className="library-gate">
          <div className="library-gate-inner">
            <div style={{ fontSize: '2rem' }}>🔒</div>
            <h3>See all {deck.cards.length} cards for free</h3>
            <p>Create a free account to unlock the full deck — no payment needed.</p>
            <button className="btn" onClick={() => setIsModalOpen(true)}>
              Create Free Account
            </button>
          </div>
        </div>
      )}

      <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
