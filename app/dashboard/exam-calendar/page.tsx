'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, CalendarDays, Trash2 } from 'lucide-react';
import { ExamDate } from '@/lib/types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function ExamCalendarPage() {
  const [exams, setExams] = useState<ExamDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/exams')
      .then(r => r.json())
      .then(data => setExams(data.exams || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setTitle(''); setSubject(''); setExamDate(''); setNotes(''); setError(null);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !examDate) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), subject: subject.trim() || undefined, exam_date: examDate, notes: notes.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to add exam.');
        return;
      }
      setExams(prev => [...prev, data.exam].sort((a, b) => a.exam_date.localeCompare(b.exam_date)));
      resetForm();
      setShowForm(false);
    } catch {
      setError('Failed to connect. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/exams?id=${id}`, { method: 'DELETE' });
    if (res.ok) setExams(prev => prev.filter(e => e.id !== id));
  };

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const examsByDay = new Map<number, ExamDate[]>();
  exams.forEach(ex => {
    const d = new Date(ex.exam_date + 'T00:00:00');
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      examsByDay.set(day, [...(examsByDay.get(day) || []), ex]);
    }
  });

  const today = startOfToday();
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const monthLabel = viewMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const upcoming = exams
    .filter(ex => new Date(ex.exam_date + 'T00:00:00') >= today)
    .sort((a, b) => a.exam_date.localeCompare(b.exam_date));

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 className="dashboard-page-title">Exam Calendar</h1>
          <p className="dashboard-page-subtitle">Add your exam and test dates to keep track of what&apos;s coming up.</p>
        </div>
        <button className="btn" onClick={() => { setShowForm(s => !s); if (showForm) resetForm(); }}>
          {showForm ? 'Cancel' : '+ Add Exam'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="exam-form">
          {error && <div className="error-message">{error}</div>}
          <div className="exam-form-grid">
            <div>
              <label className="exam-form-label">Title *</label>
              <input
                className="deck-name-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Biology Paper 1"
                maxLength={120}
                required
              />
            </div>
            <div>
              <label className="exam-form-label">Date *</label>
              <input
                className="deck-name-input"
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="exam-form-label">Subject (optional)</label>
              <input
                className="deck-name-input"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Biology"
                maxLength={60}
              />
            </div>
          </div>
          <label className="exam-form-label">Notes (optional)</label>
          <textarea
            className="deck-name-input"
            style={{ resize: 'vertical', minHeight: '60px' }}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="What do you need to revise?"
            maxLength={400}
          />
          <button className="btn" type="submit" disabled={saving} style={{ marginTop: '0.5rem' }}>
            {saving ? 'Saving…' : 'Save Exam'}
          </button>
        </form>
      )}

      <div className="exam-calendar-wrap">
        <div className="exam-calendar-nav">
          <button type="button" onClick={() => setViewMonth(new Date(year, month - 1, 1))} aria-label="Previous month"><ChevronLeft size={18} /></button>
          <span>{monthLabel}</span>
          <button type="button" onClick={() => setViewMonth(new Date(year, month + 1, 1))} aria-label="Next month"><ChevronRight size={18} /></button>
        </div>
        <div className="exam-calendar-weekdays">
          {WEEKDAYS.map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="exam-calendar-grid">
          {cells.map((day, i) => (
            <div key={i} className={`exam-calendar-cell${day === null ? ' empty' : ''}${day !== null && isToday(day) ? ' today' : ''}`}>
              {day !== null && (
                <>
                  <span className="exam-calendar-day-num">{day}</span>
                  {(examsByDay.get(day) || []).map(ex => (
                    <span key={ex.id} className="exam-calendar-pill" title={ex.title}>{ex.title}</span>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--cobalt-blue)', marginBottom: '1rem' }}>Upcoming Exams</h2>
        {loading ? (
          <div className="loading">
            <div className="spinner"><Loader2 size={40} strokeWidth={2} /></div>
          </div>
        ) : upcoming.length === 0 ? (
          <div className="dashboard-empty">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--cobalt-blue)', opacity: 0.5 }}><CalendarDays size={64} strokeWidth={1.5} /></div>
            <h2 style={{ marginBottom: '0.5rem' }}>No exams added yet</h2>
            <p style={{ opacity: 0.7 }}>Click &quot;+ Add Exam&quot; to add your first one.</p>
          </div>
        ) : (
          <div className="exam-list">
            {upcoming.map(ex => (
              <div key={ex.id} className="exam-list-row">
                <div className="exam-list-date">
                  {new Date(ex.exam_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="exam-list-info">
                  <div className="exam-list-title">{ex.title}</div>
                  {ex.subject && <div className="exam-list-subject">{ex.subject}</div>}
                  {ex.notes && <div className="exam-list-notes">{ex.notes}</div>}
                </div>
                <button className="deck-delete-btn" onClick={() => handleDelete(ex.id)} title="Delete"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
