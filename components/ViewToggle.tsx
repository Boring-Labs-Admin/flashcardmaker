'use client';
import { ViewMode } from '@/lib/types';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      {(['single', 'side-by-side', 'grid'] as ViewMode[]).map((mode) => (
        <button
          key={mode}
          className={`view-btn${currentView === mode ? ' active' : ''}`}
          onClick={() => onViewChange(mode)}
        >
          {mode === 'single' ? 'Single' : mode === 'side-by-side' ? 'Side-by-Side' : 'Grid'}
        </button>
      ))}
    </div>
  );
}