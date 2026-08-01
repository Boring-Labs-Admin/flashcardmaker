'use client';

import { StudyMode } from '@/lib/types';

export function studyModeStorageKey(classId: string): string {
  return `study_mode_${classId}`;
}

export function getStoredStudyMode(classId: string): StudyMode {
  if (typeof window === 'undefined') return 'progressive';
  return localStorage.getItem(studyModeStorageKey(classId)) === 'random' ? 'random' : 'progressive';
}

export default function StudyModeToggle({ classId, mode, onChange }: { classId: string; mode: StudyMode; onChange: (mode: StudyMode) => void }) {
  const handleChange = (next: StudyMode) => {
    localStorage.setItem(studyModeStorageKey(classId), next);
    onChange(next);
  };

  return (
    <div className="study-mode-toggle">
      <button className={mode === 'progressive' ? 'active' : ''} onClick={() => handleChange('progressive')}>
        PROGRESSIVE
      </button>
      <button className={mode === 'random' ? 'active' : ''} onClick={() => handleChange('random')}>
        RANDOM
      </button>
    </div>
  );
}
