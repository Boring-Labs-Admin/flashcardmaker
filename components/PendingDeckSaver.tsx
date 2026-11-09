'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDashboard } from '@/lib/dashboard-context';
import { restorePendingDeck, takePendingDeck } from '@/lib/pendingDeck';

// Mounted inside the dashboard. If the user generated a deck while logged out, then signed in,
// this saves it to their account and takes them to their decks.
export default function PendingDeckSaver() {
  const { handleDeckSaved } = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const pending = takePendingDeck();
    if (!pending) return;

    (async () => {
      try {
        const res = await fetch('/api/decks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: pending.title, topic: pending.topic, flashcards: pending.flashcards }),
        });
        const data = await res.json();
        if (!res.ok || !data.deck) {
          restorePendingDeck(pending);
          return;
        }
        handleDeckSaved(data.deck);
        if (pathname !== '/dashboard/decks') router.replace('/dashboard/decks');
      } catch {
        restorePendingDeck(pending);
      }
    })();
  }, [handleDeckSaved, pathname, router]);

  return null;
}
