'use client';

import { useState } from 'react';
import { TypedQuestionCard } from '@/lib/types';
import { gradeTypedAnswer } from '@/lib/fuzzyGrader';
import LatexRenderer from '@/components/LatexRenderer';

interface TypedRecallQuestionProps {
  card: TypedQuestionCard;
  onAnswered: (correct: boolean) => void;
}

export default function TypedRecallQuestion({ card, onAnswered }: TypedRecallQuestionProps) {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleSubmit = () => {
    if (submitted || !input.trim()) return;
    setCorrect(gradeTypedAnswer(input, card.acceptedAnswers));
    setSubmitted(true);
  };

  const handleOverride = () => {
    setCorrect(true);
  };

  return (
    <>
      <div className="test-question">
        <LatexRenderer text={card.flashcard.question} />
      </div>

      {!submitted ? (
        <form
          className="test-typed-form"
          onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
        >
          <input
            type="text"
            className="test-typed-input"
            placeholder="Type your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn" disabled={!input.trim()}>Submit</button>
        </form>
      ) : (
        <>
          <div className={`test-feedback-msg ${correct ? 'test-feedback-correct' : 'test-feedback-incorrect'}`}>
            {correct ? 'Correct!' : 'Not quite.'}
          </div>
          <div className="test-reveal-answer">
            <span className="test-reveal-label">Correct answer</span>
            <LatexRenderer text={card.flashcard.answer} />
          </div>
          {!correct && (
            <button className="btn-outline test-override-btn" onClick={handleOverride}>
              I was right
            </button>
          )}
          <button className="btn test-next-btn" onClick={() => onAnswered(correct)}>
            Next question →
          </button>
        </>
      )}
    </>
  );
}
