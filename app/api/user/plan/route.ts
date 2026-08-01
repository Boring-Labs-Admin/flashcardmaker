import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import type { UserPlanData } from '@/lib/plans';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ anonymous: true } satisfies Partial<UserPlanData> & { anonymous: boolean });
  }

  const { data: planData } = await supabaseAdmin
    .from('user_plans')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (!planData) {
    // Row not yet created (existing user pre-trigger) — return defaults
    return NextResponse.json({
      plan: 'free',
      free_banked: 1,
      total_remaining: 1,
    } satisfies UserPlanData);
  }

  // Calculate display free_banked (lazy grant preview — read-only, no DB write)
  const today = new Date().toISOString().split('T')[0];
  let displayBanked: number = planData.free_banked;
  let grantAmount = 0;
  if (planData.plan === 'free' && planData.last_grant_date !== today) {
    const daysDiff = Math.floor(
      (new Date(today).getTime() - new Date(planData.last_grant_date).getTime()) / 86400000
    );
    const newBanked = Math.min(planData.free_banked + daysDiff, 5);
    grantAmount = newBanked - planData.free_banked;
    displayBanked = newBanked;
  }

  const totalRemaining =
    planData.plan === 'plus' ? null : displayBanked;

  return NextResponse.json({
    plan: planData.plan,
    free_banked: displayBanked,
    total_remaining: totalRemaining,
    grant_applied: grantAmount > 0,
    grant_amount: grantAmount > 0 ? grantAmount : undefined,
  } satisfies UserPlanData);
}
