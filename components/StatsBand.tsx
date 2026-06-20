import { LIBRARY_DECKS, getDecksBySubject } from '@/lib/library';

export default function StatsBand() {
  const deckCount = LIBRARY_DECKS.length;
  const subjectCount = Object.keys(getDecksBySubject()).length;

  const stats = [
    { num: `${deckCount}+`, label: 'free ready-made decks' },
    { num: `${subjectCount}+`, label: 'subjects covered' },
    { num: '£0', label: 'to start — no card needed' },
  ];

  return (
    <div className="stats-band">
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
