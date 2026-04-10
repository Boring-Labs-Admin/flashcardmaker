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

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Generate distractors from other cards' answers in the deck.
 * For each card, pick 3 answers from other cards at random.
 * Falls back to repeating answers if the deck is tiny (< 4 cards).
 */
function generateOptionsFromDeck(deck: Deck): TestOptions {
  const result: TestOptions = {};
  const allAnswers = deck.flashcards.map(c => c.answer);

  for (const card of deck.flashcards) {
    const others = shuffle(allAnswers.filter(a => a !== card.answer));
    // Pad if fewer than 3 unique other answers (very small decks)
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

function scoreMessage(score: number, total: number): string {
  const pct = score / total;
  if (pct === 1) return 'Perfect score!';
  if (pct >= 0.8) return 'Great work!';
  if (pct >= 0.6) return 'Good effort!';
  return 'Keep practising!';
}

function initOptions(deck: Deck): TestOptions {
  // Use cached DB options if available, otherwise generate from deck
  if (deck.test_options && Object.keys(deck.test_options).length > 0) {
    return deck.test_options;
  }
  return generateOptionsFromDeck(deck);
}

export default function TestMode({ deck, onBack, onTestOptionsGenerated }: TestModeProps) {
  const [testOptions] = useState<TestOptions>(() => initOptions(deck));
  const [testCards, setTestCards] = useState<TestCard[]>(() =>
    buildTestCards(deck, initOptions(deck))
  );
  const [phase, setPhase] = useState<TestPhase>('testing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  // Persist to DB in background on first generation (fire-and-forget)
  useState(() => {
    if (!deck.test_options || Object.keys(deck.test_options).length === 0) {
      const options = generateOptionsFromDeck(deck);
      onTestOptionsGenerated(deck.id, options);
      fetch('/api/decks/test-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: deck.id, testOptions: options }),
      }).catch(() => {}); // fire-and-forget, failure is fine
    }
  });

  const handleOptionSelect = useCallback((option: string) => {
    if (selectedOption !== null) return;
    const isCorrect = option === testCards[currentIndex].correctAnswer;
    setSelectedOption(option);
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      setSelectedOption(null);
      if (currentIndex < testCards.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setPhase('complete');
      }
    }, 1200);
  }, [selectedOption, testCards, currentIndex]);

  const handleTryAgain = () => {
    // Reshuffle card order and option order — no API call
    setTestCards(buildTestCards(deck, testOptions));
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setPhase('testing');
  };

  // ── COMPLETE ─────────────────────────────────────────
  if (phase === 'complete') {
    const total = testCards.length;
    const pct = Math.round((score / total) * 100);
    return (
      <div className="test-complete">
        <div className="test-complete-score">{score} / {total}</div>
        <div className="test-complete-pct">{pct}%</div>
        <div className="test-complete-msg">{scoreMessage(score, total)}</div>
        <div className="test-complete-actions">
          <button className="btn" onClick={handleTryAgain}>Try Again</button>
          <button className="btn deck-test-btn" onClick={onBack}>← Back to Flashboard</button>
        </div>
      </div>
    );
  }

  // ── TESTING ──────────────────────────────────────────
  const card = testCards[currentIndex];

  return (
    <div className="test-mode-inner">
      <div className="test-progress">
        Question {currentIndex + 1} / {testCards.length}
      </div>

      <div className="test-question-text"><LatexRenderer text={card.flashcard.question} /></div>

      <div className="test-options-grid">
        {card.options.map((option, i) => {
          let cls = 'test-option-btn';
          if (selectedOption !== null) {
            if (option === card.correctAnswer) cls += ' correct';
            else if (option === selectedOption) cls += ' incorrect';
            else cls += ' dimmed';
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
            >
              <LatexRenderer text={option} />
            </button>
          );
        })}
      </div>

      {selectedOption !== null && (
        <div className="test-feedback">
          {selectedOption === card.correctAnswer
            ? '✓ Correct!'
            : <><span>✗ Correct answer: </span><LatexRenderer text={card.correctAnswer} /></>}
        </div>
      )}
    </div>
  );
}
