import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Flashcard } from '@/lib/types';

// GET /api/decks — fetch all decks for the logged-in user
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('decks')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ decks: data });
}

// POST /api/decks — save a new deck
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let title: string, topic: string | undefined, flashcards: unknown, classId: string | undefined;
  try {
    const body = await request.json();
    title = body.title;
    topic = body.topic;
    flashcards = body.flashcards;
    classId = body.classId;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!title || !Array.isArray(flashcards)) {
    return NextResponse.json({ error: 'title and flashcards are required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('decks')
    .insert({ user_id: session.user.id, title, topic: topic || null, flashcards, class_id: classId || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deck: data });
}

// PATCH /api/decks — update deck title, color, class, or its flashcards (editor autosave)
export async function PATCH(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let id: string, title: string | undefined, color: string | undefined, classId: string | null | undefined, flashcards: Flashcard[] | undefined;
  try {
    const body = await request.json();
    id = body.id;
    title = body.title;
    color = body.color;
    classId = body.classId;
    flashcards = body.flashcards;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (title !== undefined) updates.title = title;
  if (color !== undefined) updates.color = color;
  if (classId !== undefined) updates.class_id = classId;
  if (flashcards !== undefined) {
    if (!Array.isArray(flashcards)) {
      return NextResponse.json({ error: 'flashcards must be an array.' }, { status: 400 });
    }
    updates.flashcards = flashcards;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No fields to update.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('decks')
    .update(updates)
    .eq('id', id)
    .eq('user_id', session.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deck: data });
}

// DELETE /api/decks?id=<deckId> — delete a deck owned by the logged-in user
export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id query param required.' }, { status: 400 });
  }

  const { error } = await supabase
    .from('decks')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
