import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/classes/[id]/decks — attach an existing deck to this class
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const classId = params.id;

  let deckId: string;
  try {
    const body = await request.json();
    deckId = body.deckId;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!deckId) {
    return NextResponse.json({ error: 'deckId is required.' }, { status: 400 });
  }

  // Ownership check on the class
  const { data: cls, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('id', classId)
    .eq('user_id', userId)
    .single();

  if (classError || !cls) {
    return NextResponse.json({ error: 'Class not found.' }, { status: 404 });
  }

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .update({ class_id: classId })
    .eq('id', deckId)
    .eq('user_id', userId)
    .select()
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  return NextResponse.json({ deck });
}
