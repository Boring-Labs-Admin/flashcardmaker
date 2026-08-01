import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isPlusOrAdmin } from '@/lib/planCheck';

// POST /api/classes/[id]/duplicate — Pro only. Clones the class and its decks
// (title/description/flashcards/color), but never card_confidence — the copy
// is a fresh learning start.
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  if (!(await isPlusOrAdmin(userId, session.user.email))) {
    return NextResponse.json({ error: 'Duplicate Class is a Plus feature.', upgradeRequired: true }, { status: 403 });
  }

  const { data: original, error: classError } = await supabase
    .from('classes')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single();

  if (classError || !original) {
    return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
  }

  const { data: decks, error: deckError } = await supabase
    .from('decks')
    .select('title, topic, flashcards, color')
    .eq('user_id', userId)
    .eq('class_id', params.id);

  if (deckError) {
    return NextResponse.json({ error: deckError.message }, { status: 500 });
  }

  const { data: newClass, error: createError } = await supabase
    .from('classes')
    .insert({
      user_id: userId,
      title: `${original.title} (copy)`,
      description: original.description,
      purpose: original.purpose,
      role: original.role,
      cover_color: original.cover_color,
      cover_emoji: original.cover_emoji,
    })
    .select()
    .single();

  if (createError || !newClass) {
    return NextResponse.json({ error: createError?.message ?? 'Failed to create class copy.' }, { status: 500 });
  }

  if (decks && decks.length > 0) {
    const { error: insertDecksError } = await supabase
      .from('decks')
      .insert(decks.map(d => ({
        user_id: userId,
        class_id: newClass.id,
        title: d.title,
        topic: d.topic,
        flashcards: d.flashcards,
        color: d.color,
      })));

    if (insertDecksError) {
      return NextResponse.json({ error: insertDecksError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ class: newClass });
}
