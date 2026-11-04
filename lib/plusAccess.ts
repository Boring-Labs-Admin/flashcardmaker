import { supabaseAdmin } from '@/lib/supabase-admin';

const ADMIN_EMAIL = 'admin@boringlabs.co.uk';

// Server-side check for Plus-only features (card media, AI enhance). Admin always has access.
export async function hasPlusAccess(userId: string, email?: string | null): Promise<boolean> {
  if (email === ADMIN_EMAIL) return true;
  const { data } = await supabaseAdmin
    .from('user_plans')
    .select('plan')
    .eq('user_id', userId)
    .single();
  return data?.plan === 'plus';
}
