import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isPlusOrAdmin } from '@/lib/planCheck';

// POST /api/classes/[id]/reset-stats — Pro only. Deletes all card_confidence
// rows for this user's decks in this class, and zeroes their cached mastery_pct.
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  if (!(await isPlusOrAdmin(userId, session.user.email))) {
    return NextResponse.json({ error: 'Reset Class Stats is a Plus feature.', upgradeRequired: true }, { status: 403 });
  }

  const { data: cls, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single();

  if (classError || !cls) {
    return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
  }

  const { data: decks, error: deckError } = await supabase
    .from('decks')
    .select('id')
    .eq('user_id', userId)
    .eq('class_id', params.id);

  if (deckError) {
    return NextResponse.json({ error: deckError.message }, { status: 500 });
  }

  const deckIds = (decks ?? []).map(d => d.id);
  if (deckIds.length === 0) {
    return NextResponse.json({ success: true });
  }

  const { error: deleteError } = await supabaseAdmin
    .from('card_confidence')
    .delete()
    .eq('user_id', userId)
    .in('deck_id', deckIds);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  await supabaseAdmin
    .from('decks')
    .update({ mastery_pct: 0, last_studied_at: null })
    .in('id', deckIds);

  return NextResponse.json({ success: true });
}
