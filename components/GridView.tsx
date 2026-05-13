'use client';
import { useState } from 'react';
import { Flashcard } from '@/lib/types';
import LatexRenderer from './LatexRenderer';

export default function GridView({ flashcards }: { flashcards: Flashcard[] }) {
  const [flipped, setFlipped] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    const next = new Set(flipped);
    next.has(id) ? next.delete(id) : next.add(id);
    setFlipped(next);
  };

  return (
    <div className="grid-scroll">
      <div className="grid-view">
        {flashcards.map((card, i) => (
          <div key={card.id} className="grid-card-container" onClick={() => toggle(card.id)}>
            <div className={`grid-card${flipped.has(card.id) ? ' flipped' : ''}`}>
              <div className="grid-card-face grid-front">
                <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.4, letterSpacing: '0.1em' }}>CARD {i + 1}</div>
                <p style={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.4, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LatexRenderer text={card.question} /></p>
                <div style={{ fontSize: '0.65rem', opacity: 0.35, letterSpacing: '0.05em' }}>Click to flip</div>
              </div>
              <div className="grid-card-face grid-back">
                <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.4, letterSpacing: '0.1em' }}>ANSWER {i + 1}</div>
                <p style={{ fontWeight: 500, fontSize: '0.9rem', lineHeight: 1.4, textAlign: 'center', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LatexRenderer text={card.answer} /></p>
                <div style={{ fontSize: '0.65rem', opacity: 0.35, letterSpacing: '0.05em' }}>Click to flip</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}