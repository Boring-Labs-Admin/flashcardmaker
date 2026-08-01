'use client';

import { useRouter } from 'next/navigation';
import { ClassSummary } from '@/lib/types';
import ClassCoverIcon from './ClassCoverIcon';
import { getMasteryColour } from './DeckProgressRow';

export default function ClassCard({ cls }: { cls: ClassSummary }) {
  const router = useRouter();

  return (
    <button className="class-card" onClick={() => router.push(`/dashboard/classes/${cls.id}`)}>
      <ClassCoverIcon coverColor={cls.cover_color} coverEmoji={cls.cover_emoji} size={48} />
      <div className="class-card-body">
        <span className="class-card-title">{cls.title}</span>
        <span className="class-card-meta">{cls.deckCount} deck{cls.deckCount === 1 ? '' : 's'} · {cls.totalCards} cards</span>
        <div className="class-card-track">
          <div className="class-card-fill" style={{ width: `${Math.min(100, cls.masteryPct)}%`, background: getMasteryColour(cls.masteryPct) }} />
        </div>
      </div>
    </button>
  );
}
