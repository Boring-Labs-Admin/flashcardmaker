import { SupabaseClient } from '@supabase/supabase-js';

// Unrated cards count as 0 confidence, so mastery only approaches 100% once every
// card in the deck has actually been rated a 5 — not just the cards a user picked to rate.
export async function calculateMasteryPct(
  client: SupabaseClient,
  userId: string,
  deckId: string,
  totalCards: number
): Promise<{ masteryPct: number; ratedCount: number; sumConfidence: number; avgConfidence: number }> {
  const { data: confidenceRows } = await client
    .from('card_confidence')
    .select('confidence')
    .eq('user_id', userId)
    .eq('deck_id', deckId);

  const rows = confidenceRows ?? [];
  const sumConfidence = rows.reduce((sum, r) => sum + r.confidence, 0);
  const masteryPct = totalCards > 0 ? Math.round((sumConfidence / (totalCards * 5)) * 10000) / 100 : 0;
  const avgConfidence = rows.length > 0 ? Math.round((sumConfidence / rows.length) * 100) / 100 : 0;

  return { masteryPct, ratedCount: rows.length, sumConfidence, avgConfidence };
}
