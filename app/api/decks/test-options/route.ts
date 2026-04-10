import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { TestOptions } from '@/lib/types';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let deckId: string;
  let clientOptions: TestOptions | undefined;
  try {
    const body = await request.json();
    deckId = body.deckId;
    clientOptions = body.testOptions;
    if (!deckId) throw new Error('Missing deckId');
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Fetch deck (ownership check)
  const { data: deck, error: fetchError } = await supabaseAdmin
    .from('decks')
    .select('id, test_options')
    .eq('id', deckId)
    .eq('user_id', session.user.id)
    .single();

  if (fetchError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  // If already cached in DB, return it
  if (deck.test_options && Object.keys(deck.test_options).length > 0) {
    return NextResponse.json({ test_options: deck.test_options });
  }

  // Store the client-generated options
  if (clientOptions && Object.keys(clientOptions).length > 0) {
    await supabaseAdmin
      .from('decks')
      .update({ test_options: clientOptions })
      .eq('id', deckId)
      .eq('user_id', session.user.id);

    return NextResponse.json({ test_options: clientOptions });
  }

  return NextResponse.json({ error: 'No options provided.' }, { status: 400 });
}
