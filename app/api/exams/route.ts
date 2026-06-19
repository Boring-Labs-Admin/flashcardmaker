import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/exams — fetch all exam dates for the logged-in user
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('exam_dates')
    .select('*')
    .eq('user_id', session.user.id)
    .order('exam_date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exams: data });
}

// POST /api/exams — add a new exam date
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let title: string, subject: string | undefined, examDate: string, notes: string | undefined;
  try {
    const body = await request.json();
    title = body.title;
    subject = body.subject;
    examDate = body.exam_date;
    notes = body.notes;
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!title || !examDate) {
    return NextResponse.json({ error: 'title and exam_date are required.' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('exam_dates')
    .insert({ user_id: session.user.id, title, subject: subject || null, exam_date: examDate, notes: notes || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ exam: data });
}

// DELETE /api/exams?id=<examId> — delete an exam date owned by the logged-in user
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
    .from('exam_dates')
    .delete()
    .eq('id', id)
    .eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
