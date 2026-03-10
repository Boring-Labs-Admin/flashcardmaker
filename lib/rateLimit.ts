import crypto from 'crypto';
import { supabaseAdmin } from './supabase-admin';

export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function checkRateLimit(identifierHash: string): Promise<{ allowed: boolean; count: number }> {
  const today = new Date().toISOString().split('T')[0];
  const { count, error } = await supabaseAdmin
    .from('generations')
    .select('*', { count: 'exact', head: true })
    .eq('identifier_hash', identifierHash)
    .eq('date', today);

  if (error) {
    console.error('Rate limit check failed:', error.message);
    // Fail open on error — a DB blip shouldn't block a legitimate first generation
    return { allowed: true, count: 0 };
  }

  return { allowed: (count ?? 0) < 3, count: count ?? 0 };
}

export async function recordGeneration(identifierHash: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabaseAdmin
    .from('generations')
    .insert({ identifier_hash: identifierHash, date: today });

  if (error) {
    console.error('Failed to record generation:', error.message);
  }
}
