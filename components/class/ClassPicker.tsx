'use client';

import { Layers, Plus } from 'lucide-react';
import { ClassSummary } from '@/lib/types';
import ClassCoverIcon from './ClassCoverIcon';

export default function ClassPicker({
  classes,
  selectedId,
  onSelect,
  onCreateNew,
}: {
  classes: ClassSummary[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onCreateNew: () => void;
}) {
  return (
    <div className="class-picker">
      <span className="class-picker-label">Save to</span>
      <div className="class-picker-chips">
        <button
          className={`class-picker-chip${selectedId === null ? ' active' : ''}`}
          onClick={() => onSelect(null)}
        >
          <span className="class-picker-chip-icon class-picker-chip-icon-none"><Layers size={14} /></span>
          Uncategorised
        </button>
        {classes.map(cls => (
          <button
            key={cls.id}
            className={`class-picker-chip${selectedId === cls.id ? ' active' : ''}`}
            onClick={() => onSelect(cls.id)}
          >
            <ClassCoverIcon coverColor={cls.cover_color} coverEmoji={cls.cover_emoji} size={22} />
            {cls.title}
          </button>
        ))}
        <button className="class-picker-chip class-picker-chip-new" onClick={onCreateNew}>
          <Plus size={14} /> New Class
        </button>
      </div>
    </div>
  );
}
