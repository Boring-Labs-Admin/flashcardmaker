'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useStudySession } from './StudySessionProvider';

export default function CoachingTooltip() {
  const { coachingMessage, dismissCoaching } = useStudySession();

  useEffect(() => {
    if (!coachingMessage) return;
    const t = setTimeout(dismissCoaching, 4000);
    return () => clearTimeout(t);
  }, [coachingMessage, dismissCoaching]);

  if (!coachingMessage) return null;

  return (
    <div className="cbr-coaching-tooltip" key={coachingMessage.id}>
      <button className="cbr-coaching-close" onClick={dismissCoaching} aria-label="Dismiss"><X size={16} /></button>
      <p>{coachingMessage.text}</p>
    </div>
  );
}
