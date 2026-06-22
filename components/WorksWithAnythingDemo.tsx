'use client';

import { useState } from 'react';

const CARDS = [
  { label: 'From your PDF', question: 'What is the molar volume of an ideal gas at STP?', answer: '22.7 dm³ per mole (IUPAC, since 1982).' },
  { label: 'From a photo', question: 'Define the term "activation energy".', answer: 'The minimum energy needed for a reaction to occur.' },
  { label: 'From notes', question: 'What does STP stand for?', answer: 'Standard Temperature and Pressure.' },
  { label: 'With LaTeX', question: 'State the ideal gas law.', answer: 'PV = nRT' },
];

export default function WorksWithAnythingDemo() {
  const [flipped, setFlipped] = useState<boolean[]>(() => CARDS.map(() => false));

  const toggle = (i: number) => {
    setFlipped(prev => prev.map((f, idx) => idx === i ? !f : f));
  };

  return (
    <div className="fcard-grid">
      {CARDS.map((card, i) => (
        <button key={card.label} className={`fcard${flipped[i] ? ' flipped' : ''}`} onClick={() => toggle(i)}>
          <div className="fcard-in">
            <div className="fface ffront">
              <span className="lab">{card.label}</span>
              <span className="q">{card.question}</span>
              <span className="flip-hint">tap to flip ↻</span>
            </div>
            <div className="fface fback">
              <span className="lab">Answer</span>
              <span className="q">{card.answer}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
