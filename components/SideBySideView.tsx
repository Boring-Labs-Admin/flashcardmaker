'use client';
import { Flashcard } from '@/lib/types';

export default function SideBySideView({ flashcards }: { flashcards: Flashcard[] }) {
  return (
    <div className="sidebyside-scroll">
      {flashcards.map((card, i) => (
        <div key={card.id} className="card-pair">
          <div className="question-card">
            <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.4, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>QUESTION {i + 1}</div>
            <p style={{ fontWeight: 500, lineHeight: 1.5 }}>{card.question}</p>
          </div>
          <div className="answer-card">
            <div style={{ fontSize: '0.7rem', fontWeight: 600, opacity: 0.4, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>ANSWER {i + 1}</div>
            <p style={{ fontWeight: 500, lineHeight: 1.5 }}>{card.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}