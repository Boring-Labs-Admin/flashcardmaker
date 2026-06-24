'use client';

import { useState } from 'react';
import { ClozeQuestionCard } from '@/lib/types';
import { gradeTypedAnswer } from '@/lib/fuzzyGrader';
import LatexRenderer from '@/components/LatexRenderer';

interface ClozeQuestionProps {
  card: ClozeQuestionCard;
  onAnswered: (correct: boolean) => void;
}

const BLANK = '____';

export default function ClozeQuestion({ card, onAnswered }: ClozeQuestionProps) {
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

  const blankIndex = card.clozeSentence.indexOf(BLANK);
  const before = blankIndex >= 0 ? card.clozeSentence.slice(0, blankIndex) : card.clozeSentence;
  const after = blankIndex >= 0 ? card.clozeSentence.slice(blankIndex + BLANK.length) : '';

  return (
    <>
      <div className="test-question test-cloze-sentence">
        <LatexRenderer text={before} />
        {!submitted ? (
          <input
            type="text"
            className="test-cloze-blank-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        ) : (
          <span className={`test-cloze-blank-filled ${correct ? 'test-cloze-blank-correct' : 'test-cloze-blank-incorrect'}`}>
            {input}
          </span>
        )}
        <LatexRenderer text={after} />
      </div>

      {!submitted ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
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
