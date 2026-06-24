'use client';

import { useState, useCallback } from 'react';
import { Deck, TestOptions, TestQuestionCard, TestSelectionMode } from '@/lib/types';
import McqQuestion from '@/components/test/McqQuestion';
import TypedRecallQuestion from '@/components/test/TypedRecallQuestion';
import ClozeQuestion from '@/components/test/ClozeQuestion';

interface TestModeProps {
  deck: Deck;
  selectionMode: TestSelectionMode;
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

function generateOptionsFromDeck(deck: Deck): TestOptions {
  const result: TestOptions = {};
  const allAnswers = deck.flashcards.map(c => c.answer);
  for (const card of deck.flashcards) {
    if (card.distractors && card.distractors.length === 3) {
      result[card.id] = [card.distractors[0], card.distractors[1], card.distractors[2]];
      continue;
    }
    const others = shuffle(allAnswers.filter(a => a !== card.answer));
    while (others.length < 3) others.push(others[others.length - 1] ?? 'N/A');
    result[card.id] = [others[0], others[1], others[2]];
  }
  return result;
}

function buildTestQuestionCards(deck: Deck, options: TestOptions, selectionMode: TestSelectionMode): TestQuestionCard[] {
  return deck.flashcards.map(card => {
    if (selectionMode === 'mcq') {
      return {
        type: 'mcq',
        flashcard: card,
        options: shuffle([card.answer, ...options[card.id]]),
        correctAnswer: card.answer,
      };
    }
    if (card.cloze) {
      return {
        type: 'cloze',
        flashcard: card,
        clozeSentence: card.cloze,
        acceptedAnswers: card.acceptedAnswers ?? [card.answer],
      };
    }
    return {
      type: 'typed',
      flashcard: card,
      acceptedAnswers: card.acceptedAnswers ?? [card.answer],
    };
  });
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

export default function TestMode({ deck, selectionMode, onBack, onTestOptionsGenerated }: TestModeProps) {
  const [testOptions] = useState<TestOptions>(() => initOptions(deck));
  const [testCards, setTestCards] = useState<TestQuestionCard[]>(() => buildTestQuestionCards(deck, initOptions(deck), selectionMode));
  const [phase, setPhase] = useState<TestPhase>('testing');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  useState(() => {
    if (selectionMode === 'mcq' && (!deck.test_options || Object.keys(deck.test_options).length === 0)) {
      const options = generateOptionsFromDeck(deck);
      onTestOptionsGenerated(deck.id, options);
      fetch('/api/decks/test-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: deck.id, testOptions: options }),
      }).catch(() => {});
    }
  });

  const handleAnswered = useCallback((correct: boolean) => {
    if (correct) setScore(s => s + 1);
    if (currentIndex < testCards.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setPhase('complete');
    }
  }, [currentIndex, testCards.length]);

  const handleTryAgain = () => {
    setTestCards(buildTestQuestionCards(deck, testOptions, selectionMode));
    setCurrentIndex(0);
    setScore(0);
    setPhase('testing');
  };

  const total = testCards.length;
  const progressPct = phase === 'complete' ? 100 : (currentIndex / total) * 100;

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

        {/* Question — type-specific component */}
        {card.type === 'mcq' && (
          <McqQuestion key={currentIndex} card={card} onAnswered={handleAnswered} />
        )}
        {card.type === 'typed' && (
          <TypedRecallQuestion key={currentIndex} card={card} onAnswered={handleAnswered} />
        )}
        {card.type === 'cloze' && (
          <ClozeQuestion key={currentIndex} card={card} onAnswered={handleAnswered} />
        )}
      </div>
    </div>
  );
}
