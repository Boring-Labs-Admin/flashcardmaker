'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ClassPurpose, ClassRecord, ClassRole, ClassSummary } from '@/lib/types';

const PURPOSE_OPTIONS: { value: ClassPurpose; label: string }[] = [
  { value: 'job_skills', label: 'Job Skills' },
  { value: 'foreign_languages', label: 'Foreign Languages' },
  { value: 'professional_certification', label: 'Professional Certification' },
  { value: 'standardised_test', label: 'Standardised Test' },
  { value: 'school_university', label: 'School / University' },
  { value: 'general', label: 'General Learning/Other' },
];

type Step = 'title' | 'role' | 'purpose';

export default function ClassCreationFlow({
  onComplete,
  onCancel,
}: {
  onComplete: (cls: ClassSummary) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState<Step>('title');
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [createdClass, setCreatedClass] = useState<ClassRecord | null>(null);
  const [purpose, setPurpose] = useState<ClassPurpose | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed to create class.'); return; }
      setCreatedClass(data.class);
      setStep('role');
    } catch {
      setError('Failed to create class. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleRole = async (role: ClassRole) => {
    if (!createdClass) return;
    try {
      const res = await fetch(`/api/classes/${createdClass.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (res.ok) setCreatedClass(data.class);
    } catch {
      // Non-fatal — role stays at its default
    }
    setStep('purpose');
  };

  const handleDone = async () => {
    if (!createdClass) return;
    try {
      const res = await fetch(`/api/classes/${createdClass.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purpose }),
      });
      const data = await res.json();
      const finalClass: ClassRecord = res.ok ? data.class : createdClass;
      onComplete({
        ...finalClass,
        deckCount: 0,
        totalCards: 0,
        masteryPct: 0,
        cardsStudied: 0,
        studiedToday: false,
      });
    } catch {
      onComplete({
        ...createdClass,
        deckCount: 0,
        totalCards: 0,
        masteryPct: 0,
        cardsStudied: 0,
        studiedToday: false,
      });
    }
  };

  if (step === 'title') {
    return (
      <div className="modal-overlay active" onClick={onCancel}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-x" onClick={onCancel} aria-label="Close"><X size={18} /></button>
          <div className="modal-title">First, Create A Class</div>
          <div className="modal-subtitle">Classes keep your flashcards organised.</div>
          <input
            className="deck-name-input"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            placeholder="Class title"
            disabled={creating}
            autoFocus
          />
          {error && <div className="modal-error">{error}</div>}
          <button className="modal-btn" onClick={handleCreate} disabled={creating || !title.trim()}>
            {creating ? 'Creating…' : 'CREATE'}
          </button>
          <button className="modal-close" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  if (step === 'role' && createdClass) {
    return (
      <div className="modal-overlay active">
        <div className="modal">
          <div className="modal-title">
            <span className="class-created-name">{createdClass.title}</span> class created!
          </div>
          <div className="modal-subtitle">What&apos;s your role?</div>
          <div className="role-buttons">
            <button className="modal-btn-secondary" onClick={() => handleRole('instructor')}>I&apos;M TEACHING IT</button>
            <button className="modal-btn-secondary" onClick={() => handleRole('student')}>I&apos;M STUDYING IT</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'purpose') {
    return (
      <div className="modal-overlay active">
        <div className="modal">
          <div className="modal-title">Customize your Class</div>
          <div className="modal-subtitle">Class Purpose</div>
          <p className="purpose-question">What best describes the purpose of this class?</p>
          <div className="purpose-options">
            {PURPOSE_OPTIONS.map(opt => (
              <label key={opt.value} className="purpose-option">
                <input
                  type="radio"
                  name="purpose"
                  checked={purpose === opt.value}
                  onChange={() => setPurpose(opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <button className="modal-btn" onClick={handleDone} disabled={!purpose}>DONE</button>
        </div>
      </div>
    );
  }

  return null;
}
