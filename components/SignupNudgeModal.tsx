'use client';
import { useEffect } from 'react';
import { Zap, Check, X } from 'lucide-react';

interface SignupNudgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUp: () => void;
}

const BENEFITS = [
  'Save this deck forever and open it on any device',
  'Study mode that remembers what you know and what to revise next',
  'Track your daily streak and exam dates',
  'Download your decks as PDF or CSV',
  'Bank up to 5 free generations',
];

// Shown once per visit to logged-out users who have been looking at a generated deck for a while.
export default function SignupNudgeModal({ isOpen, onClose, onSignUp }: SignupNudgeModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="nudge-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-logo"><Zap size={48} strokeWidth={1.75} /></div>
        <div className="modal-title" id="nudge-title">Like your flashcards?</div>
        <div className="modal-subtitle">Create a free account to get more out of them:</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', textAlign: 'left', fontSize: '0.88rem', lineHeight: 1.5 }}>
          {BENEFITS.map(b => (
            <li key={b} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <Check size={16} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 3 }} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <button className="modal-btn" onClick={onSignUp}>Create free account</button>
        <button className="modal-close" onClick={onClose}><X size={14} /> Not now</button>
      </div>
    </div>
  );
}
