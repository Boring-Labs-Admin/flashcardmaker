'use client';

import { useRouter } from 'next/navigation';
import { X, Plus, FileText, UploadCloud, Wand2 } from 'lucide-react';

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

  const goTo = (start: 'notes' | 'topic') => {
    onClose();
    router.push(`/dashboard?classId=${classId}&start=${start}`);
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={18} /></button>
        <div className="modal-title" style={{ textAlign: 'center' }}>Make Flashcards</div>

        <div className="make-options">
          <button className="make-option make-option-manual" onClick={() => { onClose(); onTypeManually(); }}>
            <Plus size={26} />
            <b>Type them yourself</b>
            <span>Start a blank deck and write your own cards.</span>
          </button>
          <button className="make-option" onClick={() => goTo('notes')}>
            <FileText size={26} />
            <b>Paste your notes</b>
            <span>Drop in a big batch of text and we&apos;ll turn it into cards.</span>
          </button>
          <button className="make-option" onClick={() => goTo('notes')}>
            <UploadCloud size={26} />
            <b>Upload documents</b>
            <span>PDFs, Word docs, text files or photos of your notes.</span>
          </button>
          <button className="make-option" onClick={() => goTo('topic')}>
            <Wand2 size={26} />
            <b>Generate from a topic <span className="gen-tab-badge">PLUS</span></b>
            <span>Type a topic and a full deck is written for you.</span>
          </button>
        </div>
      </div>
    </div>
  );
}
