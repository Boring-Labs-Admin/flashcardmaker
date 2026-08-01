import { supabaseAdmin } from './supabase-admin';

const ADMIN_EMAIL = 'admin@boringlabs.co.uk';

export async function isPlusOrAdmin(userId: string, email: string | undefined): Promise<boolean> {
  if (email === ADMIN_EMAIL) return true;
  const { data } = await supabaseAdmin.from('user_plans').select('plan').eq('user_id', userId).single();
  return data?.plan === 'plus';
}
