'use client';

import { useState, useCallback } from 'react';
import { Deck, TestOptions, TestCard } from '@/lib/types';
import LatexRenderer from '@/components/LatexRenderer';

interface TestModeProps {
  deck: Deck;
  onBack: () => void;
  onTestOptionsGenerated: (deckId: string, options: TestOptions) => void;
}

type TestPhase = 'testing' | 'complete';

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

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generateOptionsFromDeck(deck: Deck): TestOptions {
  const result: TestOptions = {};
  const allAnswers = deck.flashcards.map(c => c.answer);
  for (const card of deck.flashcards) {
    const others = shuffle(allAnswers.filter(a => a !== card.answer));
    while (others.length < 3) others.push(others[others.length - 1] ?? 'N/A');
    result[card.id] = [others[0], others[1], others[2]];
  }
  return result;
}

function buildTestCards(deck: Deck, options: TestOptions): TestCard[] {
  return deck.flashcards.map(card => ({
    flashcard: card,
    options: shuffle([card.answer, ...options[card.id]]),
    correctAnswer: card.answer,
  }));
}

function scoreMessage(pct: number): string {
  if (pct === 100) return 'Perfect score! 🎉';
  if (pct >= 80) return 'Great work! 🌟';
  if (pct >= 60) return 'Good effort! Keep going 💪';
  return 'Keep practising — you\'ll get there! 📚';
}

function initOptions(deck: Deck): TestOptions {
  const cached = deck.test_options;
  if (cached && deck.flashcards.every(c => Array.isArray(cached[c.id]) && cached[c.id].length === 3)) {
    return cached;
  }
  return generateOptionsFromDeck(deck);
}

export default function TestMode({ deck, onBack, onTestOptionsGenerated }: TestModeProps) {
  const [testOptions] = useState<TestOptions>(() => initOptions(deck));
  const [testCards, setTestCards] = useState<TestCard[]>(() => buildTestCards(deck, initOptions(deck)));
  const [phase, setPhase] = useState<TestPhase>('testing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useState(() => {
    if (!deck.test_options || Object.keys(deck.test_options).length === 0) {
      const options = generateOptionsFromDeck(deck);
      onTestOptionsGenerated(deck.id, options);
      fetch('/api/decks/test-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: deck.id, testOptions: options }),
      }).catch(() => {});
    }
  });

  const handleOptionSelect = useCallback((option: string) => {
    if (selectedOption !== null) return;
    const isCorrect = option === testCards[currentIndex].correctAnswer;
    setSelectedOption(option);
    setFeedbackMsg(isCorrect ? randomFrom(CORRECT_MESSAGES) : randomFrom(INCORRECT_MESSAGES));
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setSelectedOption(null);
      setFeedbackMsg(null);
      if (currentIndex < testCards.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setPhase('complete');
      }
    }, 1000);
  }, [selectedOption, testCards, currentIndex]);

  const handleTryAgain = () => {
    setTestCards(buildTestCards(deck, testOptions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setPhase('testing');
  };

  const total = testCards.length;
  const progressPct = phase === 'complete' ? 100 : ((currentIndex + (selectedOption !== null ? 1 : 0)) / total) * 100;

  // ── COMPLETE ─────────────────────────────────────────
  if (phase === 'complete') {
    const pct = Math.round((score / total) * 100);
    const colour = pct === 100 ? '#1a7a4a' : pct >= 60 ? '#004aad' : '#b91c1c';
    return (
      <div className="test-fullpage">
        <div className="test-progress-bar-track">
          <div className="test-progress-bar-fill" style={{ width: '100%', background: colour }} />
        </div>
        <div className="test-complete-wrap">
          <div className="test-complete-circle" style={{ borderColor: colour, color: colour }}>
            <span className="test-complete-pct-big">{pct}%</span>
            <span className="test-complete-fraction">{score} / {total}</span>
          </div>
          <p className="test-complete-msg">{scoreMessage(pct)}</p>
          <div className="test-complete-actions">
            <button className="btn" onClick={handleTryAgain}>Try Again</button>
            <button className="btn-outline" onClick={onBack}>← Back to Flashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // ── TESTING ──────────────────────────────────────────
  const card = testCards[currentIndex];

  return (
    <div className="test-fullpage">
      {/* Progress bar */}
      <div className="test-progress-bar-track">
        <div
          className="test-progress-bar-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="test-body">
        {/* Counter + Exit */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="test-counter">
            <span className="test-counter-label">Question</span>
            <span className="test-counter-num">{currentIndex + 1} <span style={{ opacity: 0.35 }}>/ {total}</span></span>
          </div>
          <button className="btn-outline" onClick={onBack} style={{ fontSize: '0.78rem', padding: '0.4rem 0.9rem' }}>
            Exit
          </button>
        </div>

        {/* Question */}
        <div className="test-question">
          <LatexRenderer text={card.flashcard.question} />
        </div>

        {/* Feedback */}
        {feedbackMsg && (
          <div className={`test-feedback-msg ${selectedOption === card.correctAnswer ? 'test-feedback-correct' : 'test-feedback-incorrect'}`}>
            {feedbackMsg}
          </div>
        )}

        {/* Options */}
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
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
              >
                <span className="test-option-label">{LABELS[i]}</span>
                <span className="test-option-text"><LatexRenderer text={option} /></span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
