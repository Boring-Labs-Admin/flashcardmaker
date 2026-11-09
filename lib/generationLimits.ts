import { supabaseAdmin } from './supabase-admin';

// Abuse controls for free logged-in accounts. Sign-up needs no email confirmation, so a bot can
// create many accounts, each with free AI generations that cost real money. These limits bound
// that: per-account rate, a cooldown that stops parallel requests overspending credits, and a
// per-network daily cap that spans accounts.
export const FREE_REQUESTS_PER_MINUTE = 3;
// A generation takes ~10-20s and the credit is only deducted once Gemini returns, so without a
// cooldown several parallel requests could all pass the "has credits" check. One at a time.
export const FREE_COOLDOWN_SECONDS = 20;
// Shared IPs (schools, libraries) are legitimate, so this is deliberately generous.
export const FREE_GENERATIONS_PER_IP_PER_DAY = 40;

export interface LimitFailure {
  error: string;
  status: number;
  upgradeRequired?: boolean;
}

export async function checkFreeAccountLimits(
  userId: string,
  ip: string,
  ipHash: string
): Promise<LimitFailure | null> {
  const now = Date.now();

  // Per-account rate + cooldown. generation_log rows are written when a request STARTS
  // (see the reservation in the generate route), so in-flight requests count.
  const { data: recent, error: recentError } = await supabaseAdmin
    .from('generation_log')
    .select('created_at')
    .eq('user_id', userId)
    .gte('created_at', new Date(now - 60_000).toISOString());

  if (recentError) {
    // Fail open: a DB blip shouldn't block a legitimate user.
    console.error('Free-account limit check failed:', recentError.message);
  } else if (recent) {
    if (recent.length >= FREE_REQUESTS_PER_MINUTE) {
      return { error: 'Too many requests. Please wait a minute before creating another deck.', status: 429 };
    }
    const cooldownStart = now - FREE_COOLDOWN_SECONDS * 1000;
    if (recent.some(r => new Date(r.created_at).getTime() >= cooldownStart)) {
      return { error: 'Your previous deck is still being created. Please wait a moment.', status: 429 };
    }
  }

  // Per-network daily cap across all accounts. Skipped when the IP is unknown, otherwise every
  // such request would share one bucket.
  if (ip !== 'unknown') {
    const { count, error: ipError } = await supabaseAdmin
      .from('generation_log')
      .select('*', { count: 'exact', head: true })
      .eq('identifier_hash', ipHash)
      .not('user_id', 'is', null)
      .gte('created_at', new Date(now - 24 * 60 * 60 * 1000).toISOString());

    if (ipError) {
      console.error('IP limit check failed:', ipError.message);
    } else if ((count ?? 0) >= FREE_GENERATIONS_PER_IP_PER_DAY) {
      return {
        error: 'Too many free decks have been created from your network today. Please try again tomorrow, or upgrade to Plus.',
        status: 429,
        upgradeRequired: true,
      };
    }
  }

  return null;
}

// A "reservation" is a generation_log row inserted when a logged-in request starts. It is keyed
// by (user_id, created_at) so no assumptions are needed about the table's id column.
export interface Reservation {
  userId: string;
  createdAt: string;
}

export async function reserveGeneration(userId: string, ipHash: string): Promise<Reservation | null> {
  const createdAt = new Date().toISOString();
  const { error } = await supabaseAdmin
    .from('generation_log')
    .insert({ user_id: userId, identifier_hash: ipHash, input_chars: 0, file_count: 0, created_at: createdAt });

  if (error) {
    console.error('Failed to reserve generation slot:', error.message);
    return null; // fail open
  }
  return { userId, createdAt };
}

export async function releaseReservation(reservation: Reservation | null): Promise<void> {
  if (!reservation) return;
  const { error } = await supabaseAdmin
    .from('generation_log')
    .delete()
    .eq('user_id', reservation.userId)
    .eq('created_at', reservation.createdAt);
  if (error) console.error('Failed to release generation slot:', error.message);
}

export async function completeReservation(
  reservation: Reservation,
  details: { inputChars: number; fileCount: number }
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('generation_log')
    .update({ input_chars: details.inputChars, file_count: details.fileCount })
    .eq('user_id', reservation.userId)
    .eq('created_at', reservation.createdAt);
  if (error) console.error('Failed to finalise generation log:', error.message);
}
