import crypto from 'crypto';

export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function checkRateLimit(identifierHash: string): Promise<{ allowed: boolean; count: number }> {
  try {
    const { sql } = await import('@vercel/postgres');
    const result = await sql`
      SELECT COUNT(*) as count
      FROM generations
      WHERE identifier_hash = ${identifierHash}
      AND date = CURRENT_DATE
    `;
    const count = parseInt(result.rows[0].count, 10);
    return { allowed: count < 1, count };
  } catch {
    // Database unavailable - fail open
    return { allowed: true, count: 0 };
  }
}

export async function recordGeneration(identifierHash: string): Promise<void> {
  try {
    const { sql } = await import('@vercel/postgres');
    await sql`
      INSERT INTO generations (identifier_hash, date)
      VALUES (${identifierHash}, CURRENT_DATE)
    `;
  } catch {
    // Database unavailable - silently fail
    console.warn('Failed to record generation - database may not be configured');
  }
}
