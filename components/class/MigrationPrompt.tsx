'use client';

import { useState } from 'react';

export const MIGRATION_PROMPT_DISMISSED_KEY = 'class_migration_prompt_dismissed';

export default function MigrationPrompt({
  orphanTopic,
  onOrganise,
  onDismiss,
}: {
  orphanTopic: string;
  onOrganise: () => Promise<void>;
  onDismiss: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleOrganise = async () => {
    setLoading(true);
    await onOrganise();
    setLoading(false);
  };

  return (
    <div className="migration-prompt">
      <p>
        We&apos;ve updated how flashcards are organised. Would you like to group your existing decks into a class
        {orphanTopic ? ` called "${orphanTopic}"` : ''}?
      </p>
      <div className="migration-prompt-actions">
        <button className="btn" onClick={handleOrganise} disabled={loading}>
          {loading ? 'Organising…' : 'Yes, organise them'}
        </button>
        <button className="btn-outline" onClick={onDismiss} disabled={loading}>I&apos;ll do it later</button>
      </div>
    </div>
  );
}
