'use client';
import { useState } from 'react';
import { Flashcard } from '@/lib/types';
import LatexRenderer from './LatexRenderer';

interface SingleViewProps {
  flashcards: Flashcard[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

export default function SingleView({ flashcards, currentIndex, onNext, onPrevious }: SingleViewProps) {
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[currentIndex];

  const handleNext = () => { setFlipped(false); onNext(); };
  const handlePrev = () => { setFlipped(false); onPrevious(); };

  return (
    <div className="single-view">
      <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
        <div className={`flashcard${flipped ? ' flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-face flashcard-front">
            <div style={{ fontSize: '2rem', flexShrink: 0 }}>⚡</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '0.15em', margin: '0.5rem 0', flexShrink: 0 }}>QUESTION</div>
            <div className="flashcard-face-inner">
              <p className="flashcard-text"><LatexRenderer text={card.question} /></p>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5, flexShrink: 0, marginTop: '0.5rem' }}>Click to reveal answer</div>
          </div>
          {/* Back */}
          <div className="flashcard-face flashcard-back">
            <div style={{ fontSize: '2rem', color: 'var(--yellow-bolt)', flexShrink: 0 }}>⚡</div>
            <div style={{ fontSize: '0.7rem', opacity: 0.4, letterSpacing: '0.15em', margin: '0.5rem 0', flexShrink: 0 }}>ANSWER</div>
            <div className="flashcard-face-inner">
              <p className="flashcard-text"><LatexRenderer text={card.answer} /></p>
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5, flexShrink: 0, marginTop: '0.5rem' }}>Click to see question</div>
          </div>
        </div>
      </div>
      <div className="card-nav">
        <button className="control-btn" onClick={(e) => { e.stopPropagation(); handlePrev(); }} disabled={currentIndex === 0}>← Previous</button>
        <button className="control-btn secondary" onClick={(e) => { e.stopPropagation(); setFlipped(!flipped); }}>🔄 Flip</button>
        <button className="control-btn" onClick={(e) => { e.stopPropagation(); handleNext(); }} disabled={currentIndex === flashcards.length - 1}>Next →</button>
      </div>
    </div>
  );
}