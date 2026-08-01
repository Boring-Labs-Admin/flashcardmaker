'use client';

import { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { StudyHistoryDay } from '@/lib/types';

export default function StudyHistoryChart({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<StudyHistoryDay[] | null>(null);
  const [hovered, setHovered] = useState<StudyHistoryDay | null>(null);

  useEffect(() => {
    fetch('/api/user/study-history?days=30')
      .then(r => r.json())
      .then(data => setHistory(data.history ?? []))
      .catch(() => setHistory([]));
  }, []);

  const max = history ? Math.max(1, ...history.map(d => d.cardsStudied)) : 1;

  return (
    <div className="history-chart-overlay" onClick={onClose}>
      <div className="history-chart-panel" onClick={e => e.stopPropagation()}>
        <div className="history-chart-header">
          <h3>Study history</h3>
          <button className="history-chart-close" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        <p className="history-chart-subtitle">Cards studied per day, last 30 days</p>

        {!history ? (
          <div className="history-chart-loading"><Loader2 size={28} className="cbr-spin" /></div>
        ) : (
          <>
            <div className="history-chart-bars">
              {history.map(day => {
                const heightPct = day.cardsStudied > 0 ? Math.max(4, (day.cardsStudied / max) * 100) : 0;
                const isStreak = day.sessions > 0;
                return (
                  <div
                    key={day.date}
                    className="history-chart-bar-col"
                    onMouseEnter={() => setHovered(day)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div
                      className={`history-chart-bar${isStreak ? ' active' : ''}`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="history-chart-tooltip-row">
              {hovered ? (
                <span>
                  <b>{new Date(hovered.date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</b>
                  {' — '}{hovered.cardsStudied} card{hovered.cardsStudied === 1 ? '' : 's'} studied
                  {hovered.sessions > 0 ? `, ${hovered.sessions} session${hovered.sessions === 1 ? '' : 's'}` : ''}
                </span>
              ) : (
                <span className="history-chart-hint">Hover a bar for details</span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
