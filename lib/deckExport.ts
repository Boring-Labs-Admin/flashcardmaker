import type { Flashcard } from '@/lib/types';

// Builds a Question/Answer CSV and triggers a browser download.
// A leading byte-order mark makes Excel read accents and symbols as UTF-8 instead of garbling them.
export function downloadDeckCsv(title: string, flashcards: Pick<Flashcard, 'question' | 'answer'>[]) {
  const rows = [
    ['Question', 'Answer'],
    ...flashcards.map(f => [f.question ?? '', f.answer ?? '']),
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });

  // Strip characters that aren't allowed in file names.
  const safeTitle = (title || 'My Deck').replace(/[\\/:*?"<>|]+/g, ' ').trim() || 'My Deck';

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeTitle}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
