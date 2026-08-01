'use client';

import Link from 'next/link';
import { ClassSummary } from '@/lib/types';
import ClassCoverIcon from './ClassCoverIcon';
import { getMasteryColour } from './DeckProgressRow';

export default function ClassListItem({ cls, onNavigate }: { cls: ClassSummary; onNavigate?: () => void }) {
  return (
    <Link href={`/dashboard/classes/${cls.id}`} className="class-list-item" onClick={onNavigate}>
      <ClassCoverIcon coverColor={cls.cover_color} coverEmoji={cls.cover_emoji} size={28} />
      <div className="class-list-item-body">
        <span className="class-list-item-name">
          {cls.title}
          {cls.studiedToday && <span className="class-list-item-dot" aria-label="Studied today" />}
        </span>
        <div className="class-list-item-track">
          <div className="class-list-item-fill" style={{ width: `${Math.min(100, cls.masteryPct)}%`, background: getMasteryColour(cls.masteryPct) }} />
        </div>
      </div>
    </Link>
  );
}
