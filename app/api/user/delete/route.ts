import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

// Every table that holds a row per user. Deleting the auth user fails if any of these
// has a foreign key to auth.users without ON DELETE CASCADE, so they are all cleared first.
// Order matters little (decks cascade to card_confidence/study_sessions), but decks go
// before classes. Tables that don't exist in a given environment are skipped.
const USER_TABLES = [
  'card_confidence',
  'study_sessions',
  'generation_log',
  'enhance_log',
  'exam_dates',
  'user_stats',
  'decks',
  'classes',
  'user_plans',
] as const;

const MEDIA_BUCKET = 'card-media';

// Card media lives at <userId>/<deckId>/<cardIndex>/<file>. Storage listing isn't recursive,
// so walk the folders and collect every file path.
async function listAllFiles(prefix: string): Promise<string[]> {
  const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).list(prefix, { limit: 1000 });
  if (error || !data) return [];
  const files: string[] = [];
  for (const entry of data) {
    const path = `${prefix}/${entry.name}`;
    if (entry.id) files.push(path); // files have an id; folders don't
    else files.push(...(await listAllFiles(path)));
  }
  return files;
}

export async function DELETE() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  // Uploaded card images/audio
  try {
    const files = await listAllFiles(userId);
    if (files.length > 0) {
      await supabaseAdmin.storage.from(MEDIA_BUCKET).remove(files);
    }
  } catch (err) {
    console.error('Account deletion: failed to clean up media', err);
  }

  // Per-user rows. Missing tables are fine; any other failure is logged and reported
  // so the real cause is visible instead of a generic "failed" message.
  const failures: string[] = [];
  for (const table of USER_TABLES) {
    const { error } = await supabaseAdmin.from(table).delete().eq('user_id', userId);
    if (error && error.code !== '42P01' && error.code !== 'PGRST205') {
      console.error(`Account deletion: could not clear ${table}:`, error.message);
      failures.push(`${table}: ${error.message}`);
    }
  }

  // Delete the auth user (must be last)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) {
    console.error('Account deletion: deleteUser failed:', error.message, failures);
    return NextResponse.json(
      { error: error.message, details: failures },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
