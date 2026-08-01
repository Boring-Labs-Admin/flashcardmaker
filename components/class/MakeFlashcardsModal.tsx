'use client';

import { useRouter } from 'next/navigation';
import { X, Plus, FileText, Sparkles, Wand2 } from 'lucide-react';

export default function MakeFlashcardsModal({
  classId,
  onTypeManually,
  onClose,
}: {
  classId: string;
  onTypeManually: () => void;
  onClose: () => void;
}) {
  const router = useRouter();

  const goToGenerator = () => {
    onClose();
    router.push(`/dashboard?classId=${classId}`);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-title" style={{ textAlign: 'center' }}>Make Flashcards</div>

        <div className="make-flashcards-columns">
          <div className="make-flashcards-col">
            <h3>Manual</h3>
            <button className="make-flashcards-manual-btn" onClick={() => { onClose(); onTypeManually(); }}>
              <Plus size={22} />
              <span>Type Flashcards</span>
            </button>
          </div>

          <div className="make-flashcards-divider">— OR —</div>

          <div className="make-flashcards-col make-flashcards-col-ai">
            <h3>AI-Powered</h3>
            <button className="make-flashcards-ai-btn" onClick={goToGenerator}>
              <FileText size={18} />
              <span>Import/Paste Flashcards</span>
            </button>
            <button className="make-flashcards-ai-btn" onClick={goToGenerator}>
              <Sparkles size={18} />
              <span>Summarise From Content</span>
            </button>
            <button className="make-flashcards-ai-btn" onClick={goToGenerator}>
              <Wand2 size={18} />
              <span>Just Tell AI What I Want</span>
            </button>
          </div>
        </div>

        <p className="modal-note">💡 You can always switch between manual and automatic creation once you are in Edit mode.</p>
      </div>
    </div>
  );
}
