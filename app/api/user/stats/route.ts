import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { UserStats } from '@/lib/types';

// GET /api/user/stats — streak, studied-today, and daily-average stats for the dashboard sidebar
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: stats } = await supabaseAdmin
    .from('user_stats')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (!stats) {
    return NextResponse.json({
      streak: 0,
      longestStreak: 0,
      studiedToday: false,
      avgPerDay: 0,
      totalPoints: 0,
    } satisfies UserStats);
  }

  const today = new Date().toISOString().split('T')[0];
  const studiedToday = stats.last_studied_date === today;

  const createdAt = session.user.created_at ? new Date(session.user.created_at) : new Date();
  const daysSinceCreated = Math.max(1, Math.ceil((Date.now() - createdAt.getTime()) / 86_400_000));
  const avgPerDay = Math.round((stats.total_days_studied / daysSinceCreated) * 100) / 100;

  return NextResponse.json({
    streak: stats.current_streak,
    longestStreak: stats.longest_streak,
    studiedToday,
    avgPerDay,
    totalPoints: stats.total_points,
  } satisfies UserStats);
}
