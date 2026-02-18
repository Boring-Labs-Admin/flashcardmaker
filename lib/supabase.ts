import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function createSupabaseClient() {
  try {
    return createClientComponentClient();
  } catch {
    return null;
  }
}
