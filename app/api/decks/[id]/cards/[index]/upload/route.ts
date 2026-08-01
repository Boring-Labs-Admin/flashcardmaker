import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Flashcard } from '@/lib/types';

export const maxDuration = 30;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const AUDIO_MIME_TYPES = new Set(['audio/mpeg']);

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'audio/mpeg': 'mp3',
};

// POST /api/decks/[id]/cards/[index]/upload — upload an image or audio clip for one card side
export async function POST(request: NextRequest, { params }: { params: { id: string; index: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const deckId = params.id;
  const cardIndex = parseInt(params.index, 10);

  if (!Number.isInteger(cardIndex) || cardIndex < 0) {
    return NextResponse.json({ error: 'Invalid card index.' }, { status: 400 });
  }

  const { data: deck, error: deckError } = await supabase
    .from('decks')
    .select('id, flashcards')
    .eq('id', deckId)
    .eq('user_id', userId)
    .single();

  if (deckError || !deck) {
    return NextResponse.json({ error: 'Deck not found.' }, { status: 404 });
  }

  const flashcards: Flashcard[] = Array.isArray(deck.flashcards) ? deck.flashcards : [];
  if (cardIndex >= flashcards.length) {
    return NextResponse.json({ error: 'Card index out of range.' }, { status: 400 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid multipart form data.' }, { status: 400 });
  }

  const file = formData.get('file');
  const side = formData.get('side');
  const type = formData.get('type');

  if (!(file instanceof File) || (side !== 'question' && side !== 'answer') || (type !== 'image' && type !== 'audio')) {
    return NextResponse.json({ error: 'file, side ("question"|"answer"), and type ("image"|"audio") are required.' }, { status: 400 });
  }

  const validMimeTypes = type === 'image' ? IMAGE_MIME_TYPES : AUDIO_MIME_TYPES;
  if (!validMimeTypes.has(file.type)) {
    return NextResponse.json({ error: `Unsupported file type for ${type}: ${file.type}` }, { status: 400 });
  }

  const maxBytes = type === 'image' ? MAX_IMAGE_BYTES : MAX_AUDIO_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json({ error: `File is too large (max ${maxBytes / 1024 / 1024}MB).` }, { status: 400 });
  }

  const ext = EXT_BY_MIME[file.type];
  const path = `${userId}/${deckId}/${cardIndex}/${side}-${type}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabaseAdmin.storage
    .from('card-media')
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage.from('card-media').getPublicUrl(path);
  const url = publicUrlData.publicUrl;

  const fieldName = `${side}${type === 'image' ? 'Image' : 'Audio'}` as keyof Flashcard;
  const updatedCards = flashcards.map((card, i) => i === cardIndex ? { ...card, [fieldName]: url } : card);

  const { error: updateError } = await supabaseAdmin
    .from('decks')
    .update({ flashcards: updatedCards })
    .eq('id', deckId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ url });
}
