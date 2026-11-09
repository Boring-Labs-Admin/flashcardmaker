// The dashboard sidebar caches streak/studied-today for a few minutes. Anything that changes those
// numbers (finishing a study session) must clear the cache so the next view shows fresh values.
export const STATS_CACHE_KEY = 'user_stats_cache';
export const STATS_CACHE_TTL_MS = 5 * 60 * 1000;

export function invalidateStatsCache() {
  try {
    sessionStorage.removeItem(STATS_CACHE_KEY);
  } catch {
    // ignore
  }
}
