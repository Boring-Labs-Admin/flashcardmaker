'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LatexRenderer from '@/components/LatexRenderer';
import FlashboardModal from '@/components/FlashboardModal';
import type { LibraryDeck } from '@/lib/library';
import { DECK_SEO } from '@/lib/library-seo';

const FREE_LIMIT = 10;

export default function LibraryDeckView({ deck }: { deck: LibraryDeck }) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';
  const backHref = fromDashboard ? '/dashboard' : '/';
  const backLabel = fromDashboard ? '← Flashboard' : '← Home';
  const seo = DECK_SEO[deck.slug];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const visibleCards = user ? deck.cards : deck.cards.slice(0, FREE_LIMIT);
  const hasGate = !user && deck.cards.length > FREE_LIMIT;

  const toggleFlip = (i: number) =>
    setFlipped(f => ({ ...f, [i]: !f[i] }));

  const saveToFlashboard = async () => {
    if (saving || saved) return;
    setSaving(true);
    try {
      const flashcards = deck.cards.map(card => ({
        id: crypto.randomUUID(),
        question: card.question,
        answer: card.answer,
      }));
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: deck.title, topic: deck.topic, flashcards }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="library-deck-header">
        <Link href={backHref} className="back-link">{backLabel}</Link>
        <h1 className="library-deck-title">{seo?.h1 ?? deck.title}</h1>
        {seo?.h2 && <h2 className="library-deck-subtitle">{seo.h2}</h2>}
        {seo?.intro && <p className="library-deck-intro">{seo.intro}</p>}
        <p className="library-deck-meta">{deck.cards.length} cards · {deck.subject}</p>
        {user && (
          <button
            className="btn"
            style={{ marginTop: '0.75rem', fontSize: '0.85rem', padding: '0.5rem 1.25rem' }}
            onClick={saveToFlashboard}
            disabled={saving || saved}
          >
            {saved ? '✓ Saved to Flashboard' : saving ? 'Saving…' : 'Save to Flashboard'}
          </button>
        )}
      </div>

      <div className="library-card-grid">
        {visibleCards.map((card, i) => (
          <div
            key={i}
            className={`library-card${flipped[i] ? ' flipped' : ''}`}
            onClick={() => toggleFlip(i)}
          >
            <div className="library-card-inner">
              <div className="library-card-face library-card-front">
                <span className="library-card-label">Question</span>
                <div className="library-card-text"><LatexRenderer text={card.question} /></div>
                <div className="library-card-hint">tap to flip</div>
              </div>
              <div className="library-card-face library-card-back">
                <span className="library-card-label">Answer</span>
                <div className="library-card-text"><LatexRenderer text={card.answer} /></div>
                <div className="library-card-hint">tap to flip</div>
              </div>
            </div>
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
