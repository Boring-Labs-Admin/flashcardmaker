'use client';

import { Search, Plus, Brain, X } from 'lucide-react';

export const ONBOARDING_MODAL_SEEN_KEY = 'onboarding_modal_seen';

export default function OnboardingModal({
  onFindFlashcards,
  onMakeFlashcards,
  onJustGetSmarter,
  onClose,
}: {
  onFindFlashcards: () => void;
  onMakeFlashcards: () => void;
  onJustGetSmarter: () => void;
  onClose: () => void;
}) {
  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal onboarding-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-title">How would you like to start?</div>
        <div className="onboarding-options">
          <button className="onboarding-option" onClick={onFindFlashcards}>
            <Search size={32} strokeWidth={1.75} />
            <span>Find Flashcards</span>
          </button>
          <button className="onboarding-option" onClick={onMakeFlashcards}>
            <Plus size={32} strokeWidth={1.75} />
            <span>Make Flashcards</span>
          </button>
          <button className="onboarding-option" onClick={onJustGetSmarter}>
            <Brain size={32} strokeWidth={1.75} />
            <span>Just Get Smarter!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
