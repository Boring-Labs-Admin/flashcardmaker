import { supabaseAdmin } from './supabase-admin';

// Single server-side check for Plus-only features. Access comes purely from the
// user's plan row (user_plans.plan) — no account is special-cased by email.
export async function isPlusUser(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin.from('user_plans').select('plan').eq('user_id', userId).single();
  return data?.plan === 'plus';
}
