'use client';

import { useState } from 'react';
import { McqQuestionCard } from '@/lib/types';
import LatexRenderer from '@/components/LatexRenderer';

interface McqQuestionProps {
  card: McqQuestionCard;
  onAnswered: (correct: boolean) => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

const CORRECT_MESSAGES = [
  'Nailed it! ⚡',
  'Correct! Keep going!',
  'That\'s the one!',
  'Boom! Right answer.',
  'You got it!',
  'Spot on!',
  'Brilliant!',
  'Exactly right!',
  'Yes! That\'s it!',
  'Perfect!',
  'On a roll!',
  'Nice work!',
];

const INCORRECT_MESSAGES = [
  'Not quite — check the answer.',
  'Almost! Review and move on.',
  'Don\'t worry, keep going!',
  'Tricky one — you\'ll get it next time.',
  'Take note of this one.',
  'That\'s a tough one.',
  'Close — remember this!',
  'Everyone misses this sometimes.',
  'Keep going, you\'ve got this!',
  'Note it down and move on.',
];

function randomFrom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function McqQuestion({ card, onAnswered }: McqQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    if (selectedOption !== null) return;
    const isCorrect = option === card.correctAnswer;
    setSelectedOption(option);
    setFeedbackMsg(isCorrect ? randomFrom(CORRECT_MESSAGES) : randomFrom(INCORRECT_MESSAGES));

    setTimeout(() => {
      onAnswered(isCorrect);
    }, 1000);
  };

  return (
    <>
      <div className="test-question">
        <LatexRenderer text={card.flashcard.question} />
      </div>

      {feedbackMsg && (
        <div className={`test-feedback-msg ${selectedOption === card.correctAnswer ? 'test-feedback-correct' : 'test-feedback-incorrect'}`}>
          {feedbackMsg}
        </div>
      )}

      <div className="test-options-grid">
        {card.options.map((option, i) => {
          const isCorrect = option === card.correctAnswer;
          const isSelected = option === selectedOption;
          let state: 'idle' | 'correct' | 'incorrect' | 'dimmed' = 'idle';
          if (selectedOption !== null) {
            if (isCorrect) state = 'correct';
            else if (isSelected) state = 'incorrect';
            else state = 'dimmed';
          }
          return (
            <button
              key={i}
              className={`test-option-btn test-option-${state}`}
              onClick={() => handleSelect(option)}
              disabled={selectedOption !== null}
            >
              <span className="test-option-label">{LABELS[i]}</span>
              <span className="test-option-text"><LatexRenderer text={option} /></span>
            </button>
          );
        })}
      </div>
    </>
  );
}
