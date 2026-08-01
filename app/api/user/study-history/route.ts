import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { StudyHistoryDay } from '@/lib/types';

export const dynamic = 'force-dynamic';

// GET /api/user/study-history?days=30 — daily study counts for the history chart
export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const daysParam = parseInt(request.nextUrl.searchParams.get('days') ?? '30', 10);
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 90) : 30;

  const since = new Date(Date.now() - days * 86_400_000).toISOString();

  const { data: sessions, error } = await supabase
    .from('study_sessions')
    .select('started_at, cards_studied')
    .eq('user_id', session.user.id)
    .not('completed_at', 'is', null)
    .gte('started_at', since);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const byDate = new Map<string, { sessions: number; cardsStudied: number }>();
  (sessions ?? []).forEach(row => {
    const date = row.started_at.split('T')[0];
    const existing = byDate.get(date) ?? { sessions: 0, cardsStudied: 0 };
    existing.sessions += 1;
    existing.cardsStudied += row.cards_studied ?? 0;
    byDate.set(date, existing);
  });

  const history: StudyHistoryDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86_400_000);
    const dateStr = d.toISOString().split('T')[0];
    const entry = byDate.get(dateStr) ?? { sessions: 0, cardsStudied: 0 };
    history.push({ date: dateStr, sessions: entry.sessions, cardsStudied: entry.cardsStudied });
  }

  return NextResponse.json({ history });
}
