'use client';

import { useState } from 'react';

interface ClassMoreMenuProps {
  isPlusOrAdmin: boolean;
  onImportMakeFlashcards: () => void;
  onDuplicate: () => void;
  onResetStats: () => void;
  onRemove: () => void;
  onRequireUpgrade: () => void;
}

export default function ClassMoreMenu({
  isPlusOrAdmin,
  onImportMakeFlashcards,
  onDuplicate,
  onResetStats,
  onRemove,
  onRequireUpgrade,
}: ClassMoreMenuProps) {
  const [open, setOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const proAction = (action: () => void) => () => {
    setOpen(false);
    if (!isPlusOrAdmin) { onRequireUpgrade(); return; }
    action();
  };

  return (
    <div className="class-more-menu-wrap">
      <button className="class-more-btn" onClick={() => setOpen(o => !o)} aria-label="More options">⋯</button>
      {open && (
        <div className="class-more-menu" onMouseLeave={() => setOpen(false)}>
          <button onClick={() => { setOpen(false); onImportMakeFlashcards(); }}>Import/Make Flashcards</button>
          <button className={!isPlusOrAdmin ? 'gated' : ''} onClick={proAction(onDuplicate)}>
            Duplicate Class {!isPlusOrAdmin && <span className="pro-badge">PRO</span>}
          </button>
          <button className="disabled" disabled title="Coming soon">
            Mirror Decks to New Class <span className="pro-badge">PRO</span>
          </button>
          <button className={!isPlusOrAdmin ? 'gated' : ''} onClick={proAction(() => setConfirmReset(true))}>
            Reset Class Stats {!isPlusOrAdmin && <span className="pro-badge">PRO</span>}
          </button>
          <button className="danger" onClick={() => { setOpen(false); setConfirmRemove(true); }}>Remove from your Classes</button>
          <button className="disabled" disabled title="Coming soon">Make Class Private <span className="pro-badge">PRO</span></button>
          <button className="disabled" disabled title="Coming soon">Preview Public Class Page</button>
          <button className="disabled" disabled title="Coming soon">Edit Suggestions Dashboard</button>
        </div>
      )}

      {confirmReset && (
        <div className="class-more-confirm-overlay" onClick={() => setConfirmReset(false)}>
          <div className="class-more-confirm" onClick={e => e.stopPropagation()}>
            <p>This will reset all your progress for this class. Are you sure?</p>
            <div className="class-more-confirm-actions">
              <button className="btn-outline" onClick={() => setConfirmReset(false)}>Cancel</button>
              <button className="btn" onClick={() => { setConfirmReset(false); onResetStats(); }}>Reset Stats</button>
            </div>
          </div>
        </div>
      )}

      {confirmRemove && (
        <div className="class-more-confirm-overlay" onClick={() => setConfirmRemove(false)}>
          <div className="class-more-confirm" onClick={e => e.stopPropagation()}>
            <p>Remove this class? Its decks will become uncategorised, not deleted.</p>
            <div className="class-more-confirm-actions">
              <button className="btn-outline" onClick={() => setConfirmRemove(false)}>Cancel</button>
              <button className="btn" onClick={() => { setConfirmRemove(false); onRemove(); }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
