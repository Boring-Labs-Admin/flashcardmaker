'use client';
import { useAuth } from '@/lib/auth-context';

interface FlashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FlashboardModal({ isOpen, onClose }: FlashboardModalProps) {
  const { user, signInWithGoogle } = useAuth();
  if (!isOpen) return null;

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-logo">⚡</div>
        <div className="modal-title">Your Flashboard</div>
        <div className="modal-subtitle">
          {user
            ? 'Deck saving is coming soon. Stay tuned!'
            : 'Save your decks, access them anywhere, and track your progress.'}
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
        <button className="modal-close" onClick={onClose}>✕ Not now, continue studying</button>
      </div>
    </div>
  );
}