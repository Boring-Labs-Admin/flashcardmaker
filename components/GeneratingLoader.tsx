'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

const MESSAGES = [
  'Reading your content...',
  'Spotting the key concepts...',
  'Drafting questions...',
  'Writing clear answers...',
  'Double-checking accuracy...',
  'Polishing your deck...',
  'Almost there...',
];

export default function GeneratingLoader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex(i => Math.min(i + 1, MESSAGES.length - 1));
    }, 2200);

    // Eases toward 95% — never claims to finish before the API actually responds
    const progressTimer = setInterval(() => {
      setProgress(p => p + (95 - p) * 0.1);
    }, 350);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="loading">
      <div className="spinner"><Zap size={48} strokeWidth={1.75} /></div>
      <h2 style={{ fontSize: '2rem', marginTop: '1rem' }}>Creating Your Flashcards</h2>
      <p className="loading-status" key={messageIndex}>{MESSAGES[messageIndex]}</p>
      <div className="loading-progress-track">
        <div className="loading-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p style={{ opacity: 0.5, fontSize: '0.8rem', marginTop: '0.75rem' }}>This usually takes about 10–20 seconds.</p>
    </div>
  );
}
