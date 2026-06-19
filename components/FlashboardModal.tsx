'use client';
import { useAuth } from '@/lib/auth-context';

export type FlashboardModalReason = 'save' | 'test' | 'library' | 'generic';

interface FlashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: FlashboardModalReason;
}

const SUBTITLES: Record<FlashboardModalReason, string> = {
  save: 'Create a free account to save this deck forever — access it anytime from your Flashboard.',
  test: 'Create a free account to test yourself on this deck with a multiple-choice quiz.',
  library: 'Create a free account to see every card in this deck — no payment needed.',
  generic: 'Save your decks, access them anywhere, and track your progress.',
};

export default function FlashboardModal({ isOpen, onClose, reason = 'generic' }: FlashboardModalProps) {
  const { user, signInWithGoogle } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-logo">⚡</div>
        <div className="modal-title">Log in to your Flashboard</div>
        <div className="modal-subtitle">
          {SUBTITLES[reason]}
        </div>
        {!user ? (
          <>
            <button className="modal-btn" onClick={signInWithGoogle}>
              Continue with Google
            </button>
          </>
        ) : (
          <div style={{ background: 'var(--light-blue)', border: '2px solid var(--cobalt-blue)', borderRadius: 8, padding: '1rem', marginBottom: '1rem', fontSize: '0.9rem' }}>
            ✨ Coming soon for logged-in users
          </div>
        )}
        <button className="modal-close" onClick={onClose}>✕ Not now</button>
      </div>
    </div>
  );
}