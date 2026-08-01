import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60; // seconds — allows time for file processing + Gemini inference
import { GoogleGenAI, Type } from '@google/genai';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { hashIP, checkRateLimit, recordGeneration } from '@/lib/rateLimit';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { PLANS } from '@/lib/plans';
import mammoth from 'mammoth';

const DOCX_MIME_TYPES = new Set([
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
]);

const SUPPORTED_INLINE_MIME_TYPES = new Set([
  'application/pdf',
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
  'image/webp', 'image/heic', 'image/heif',
]);

const ADMIN_EMAIL = 'admin@boringlabs.co.uk';
const PLUS_REQUESTS_PER_MINUTE = 10;
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB total base64 payload

export async function POST(request: NextRequest) {
  // 1. Check API key / emergency shutoff
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Flashcard creation is not configured yet. Please add your GEMINI_API_KEY to the .env.local file.' },
      { status: 503 }
    );
  }

  if (process.env.DISABLE_GENERATION === 'true') {
    return NextResponse.json(
      { error: 'Flashcard generation is temporarily unavailable. Please try again later.' },
      { status: 503 }
    );
  }

  // 2. Get session
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  // IP identifier (used for anonymous rate limiting)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const identifier = hashIP(ip);

  // 3. Determine card/char limits and enforce rate limiting
  let cardLimit: number = PLANS.free.cardLimit;
  let charLimit: number = PLANS.free.charLimit;
  let fileLimit: number = PLANS.free.fileLimit;
  let isAnonymous = false;

  // User ID to deduct from — set for free-plan users, null for admin/plus/anonymous
  let creditUserId: string | null = null;
  // User ID for generation logging and rate limiting — set for all logged-in users
  let loggedInUserId: string | null = null;
  // Whether this user can use Plus-only features
  let isPlusOrAdmin = isAdmin;

  if (isAdmin) {
    cardLimit = PLANS.plus.cardLimit;
    charLimit = PLANS.plus.charLimit;
    fileLimit = PLANS.plus.fileLimit;
  } else if (session?.user) {
    // Logged-in user — use user_plans
    const userId = session.user.id;
    loggedInUserId = userId;

    let { data: planData } = await supabaseAdmin
      .from('user_plans')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!planData) {
      // Existing user pre-trigger — create their row now
      const { data: newPlan } = await supabaseAdmin
        .from('user_plans')
        .upsert({ user_id: userId }, { onConflict: 'user_id' })
        .select()
        .single();
      planData = newPlan;
    }

    if (!planData) {
      return NextResponse.json({ error: 'Could not load user plan. Please try again.' }, { status: 500 });
    }

    if (planData.plan === 'plus') {
      isPlusOrAdmin = true;
      cardLimit = PLANS.plus.cardLimit;
      charLimit = PLANS.plus.charLimit;
      fileLimit = PLANS.plus.fileLimit;

      // Per-minute rate limit for Plus users — prevents automated flooding
      const { count: recentCount } = await supabaseAdmin
        .from('generation_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 60_000).toISOString());

      if ((recentCount ?? 0) >= PLUS_REQUESTS_PER_MINUTE) {
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment before generating again.' },
          { status: 429 }
        );
      }
    } else {
      // Lazy free generation grant: credit days elapsed since last grant, cap at 5
      const today = new Date().toISOString().split('T')[0];
      let currentBanked: number = planData.free_banked;

      if (planData.last_grant_date !== today) {
        const daysDiff = Math.floor(
          (new Date(today).getTime() - new Date(planData.last_grant_date).getTime()) / 86400000
        );
        currentBanked = Math.min(planData.free_banked + daysDiff, 5);
        await supabaseAdmin
          .from('user_plans')
          .update({ free_banked: currentBanked, last_grant_date: today, updated_at: new Date().toISOString() })
          .eq('user_id', userId);
      }

      // Early quota check — fast-fail before calling Gemini if definitely out of credits
      // Authoritative deduction happens atomically via DB function after successful generation
      if (currentBanked > 0) {
        creditUserId = userId;
      } else {
        return NextResponse.json(
          { error: 'You have no generations remaining.', upgradeRequired: true },
          { status: 429 }
        );
      }

      cardLimit = PLANS.free.cardLimit;
      charLimit = PLANS.free.charLimit;
    }
  } else {
    // Anonymous user — IP-based rate limiting
    isAnonymous = true;
    const { allowed } = await checkRateLimit(identifier);
    if (!allowed) {
      return NextResponse.json(
        { error: "You've used your free generation for today.", upgradeRequired: true, anonymous: true },
        { status: 429 }
      );
    }
  }

  // 4. Parse and validate request
  let rawContent: string | string[];
  let topic: string | undefined;

  let generationMode: string | undefined;
  try {
    const body = await request.json();
    rawContent = body.content;
    topic = body.topic;
    generationMode = body.generationMode;
  } catch {
    return NextResponse.json({ error: 'Invalid request format.' }, { status: 400 });
  }

  // Prompt-only generation — Plus/admin only, skip content validation
  if (generationMode === 'prompt') {
    if (!isPlusOrAdmin) {
      return NextResponse.json(
        { error: 'Generating from a prompt is a Plus feature. Upgrade to unlock it.' },
        { status: 403 }
      );
    }
    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: 'Please enter a prompt to generate flashcards from.' },
        { status: 400 }
      );
    }
  } else {
    const contents: string[] = Array.isArray(rawContent) ? rawContent : [rawContent];

    const textContents = contents.filter((c) => typeof c === 'string' && !c.startsWith('data:'));
    const fileContents = contents.filter((c) => typeof c === 'string' && c.startsWith('data:'));

    // Text-only submissions need a meaningful amount of content so the AI cannot
    // generate cards from general knowledge using just a word or short phrase.
    const minTextLength = fileContents.length > 0 ? 10 : 150;
    const totalTextLength_check = textContents.reduce((sum, c) => sum + c.trim().length, 0);
    const hasContent = fileContents.length > 0 || totalTextLength_check >= minTextLength;

    if (!hasContent) {
      return NextResponse.json(
        {
          error: totalTextLength_check > 0
            ? `Please paste more of your study notes. A minimum of 150 characters is needed — try adding a few paragraphs of content.`
            : 'Please paste your study notes or upload a file to generate flashcards.',
        },
        { status: 400 }
      );
    }

    // Check character limit on plain text content
    const totalTextLength = contents
      .filter((c) => typeof c === 'string' && !c.startsWith('data:'))
      .reduce((sum, c) => sum + c.length, 0);

    if (totalTextLength > charLimit) {
      return NextResponse.json(
        {
          error: `Your text is too long. The limit is ${charLimit.toLocaleString()} characters${
            charLimit === PLANS.free.charLimit ? ' — upgrade to Plus for a higher limit.' : '.'
          }`,
          charsOver: totalTextLength - charLimit,
        },
        { status: 400 }
      );
    }

    // Check file limit
    const fileCount = contents.filter((c) => typeof c === 'string' && c.startsWith('data:')).length;
    if (fileCount > fileLimit) {
      return NextResponse.json(
        {
          error: `You can upload up to ${fileLimit} file${fileLimit === 1 ? '' : 's'} per generation${
            fileLimit === PLANS.free.fileLimit ? ' on the free plan — upgrade to Plus for more.' : '.'
          }`,
        },
        { status: 400 }
      );
    }

    // Check total file payload size — prevents large files inflating token cost
    const totalFileBytes = contents
      .filter((c) => typeof c === 'string' && c.startsWith('data:'))
      .reduce((sum, c) => sum + c.length, 0);
    if (totalFileBytes > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'Total file size is too large. Please reduce the number or size of uploaded files.' },
        { status: 400 }
      );
    }
  }

  const contents: string[] = Array.isArray(rawContent) ? rawContent : [rawContent];

  // 5. Build the Gemini request
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const instructionText = generationMode === 'prompt'
    ? `Create up to ${cardLimit} flashcards about: ${topic}. Use your knowledge to cover key concepts, definitions, important facts, and common exam questions on this topic comprehensively.`
    : topic
      ? `Create flashcards about ${topic} using ONLY the content provided below. Do not add any information beyond what is in the provided content.`
      : `Create flashcards using ONLY the content provided below. Do not add any information beyond what is in the provided content.`;

  let contentParts: object[];
  let targetLine: string;
  if (generationMode === 'prompt') {
    contentParts = [{ text: instructionText }];
    targetLine = `- Aim for approximately ${cardLimit} flashcards covering this topic comprehensively — do not stop early. Never exceed ${cardLimit}.`;
  } else {
    const fileParts: object[] = [];
    const textChunks: string[] = [];

    for (const c of contents) {
      if (typeof c === 'string' && c.startsWith('data:')) {
        const commaIndex = c.indexOf(',');
        const header = c.slice(0, commaIndex);
        const base64Data = c.slice(commaIndex + 1);
        const mimeType = header.split(':')[1].split(';')[0];

        if (DOCX_MIME_TYPES.has(mimeType)) {
          // Extract plain text from Word documents so Gemini can process them
          try {
            const buffer = Buffer.from(base64Data, 'base64');
            const { value: docText } = await mammoth.extractRawText({ buffer });
            if (docText.trim()) textChunks.push(docText);
          } catch (docErr) {
            console.error('Failed to extract text from Word document:', docErr);
            return NextResponse.json(
              { error: 'Could not read the Word document. Please save it as a PDF or copy-paste the text instead.' },
              { status: 400 }
            );
          }
        } else if (SUPPORTED_INLINE_MIME_TYPES.has(mimeType)) {
          fileParts.push({ inlineData: { mimeType, data: base64Data } });
        } else {
          // Unsupported file type — return a clear error rather than letting Gemini throw
          return NextResponse.json(
            { error: `Unsupported file type (${mimeType}). Please upload a PDF, image, Word document, or paste your text directly.` },
            { status: 400 }
          );
        }
      } else if (typeof c === 'string' && c.trim().length > 0) {
        textChunks.push(c);
      }
    }

    // A vague "generate as many as the content supports" instruction measurably caused the model to
    // stop early (verified in testing) — anchoring it on a concrete number recovers full coverage.
    // ~110 chars of dense study notes tends to support one single-fact flashcard; files get a flat
    // per-file estimate since their extracted text length isn't known until Gemini parses them.
    const textCharCount = textChunks.reduce((sum, t) => sum + t.length, 0);
    const estimatedCharCount = textCharCount + fileParts.length * 1500;
    const estimatedTarget = Math.max(8, Math.min(cardLimit, Math.round(estimatedCharCount / 110)));
    targetLine = `- This content can reasonably support approximately ${estimatedTarget} distinct flashcards. Aim for that many — do not stop early or consolidate facts together just to produce a shorter deck. Never exceed ${cardLimit}. If the content is genuinely too brief to support that many distinct facts, it's fine to return fewer.`;

    if (fileParts.length > 0) {
      contentParts = [
        ...fileParts,
        ...(textChunks.length > 0 ? [{ text: textChunks.join('\n\n') }] : []),
        { text: instructionText },
      ];
    } else {
      contentParts = [{ text: `${instructionText}\n\n${textChunks.join('\n\n')}` }];
    }
  }

  const systemPrompt = `You are a flashcard creation assistant. Your job is to create study flashcards based strictly on the content provided by the user.

Rules:
${targetLine}
- Break the content down into the smallest distinct testable facts, definitions, processes, or equations — do NOT consolidate multiple separate facts into one flashcard. If a paragraph contains several distinct facts, create a separate flashcard for each one.
- Each flashcard must have a clear, specific question and a concise, accurate answer
- Questions should test understanding, not just recall
- Answers should be brief but complete (1-3 sentences)
- Do not begin answers by restating the question or using prefatory phrases (e.g. "The answer is...", "The reaction for X is:"). State the answer directly.
- For mathematical expressions, use LaTeX notation: inline math with $...$ and block equations with $$...$$
- Return ONLY a valid JSON array of objects with "question" and "answer" fields
- IMPORTANT: Base every question and answer ONLY on information explicitly present in the provided content. Do NOT use general knowledge or add information not found in the content. If the content is too brief to support meaningful flashcards, return fewer cards.`;

  const flashcardResponseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING, description: 'The flashcard question.' },
        answer: { type: Type.STRING, description: 'The concise, accurate answer to the question.' },
      },
      required: ['question', 'answer'],
      propertyOrdering: ['question', 'answer'],
    },
  };

  try {
    let response;
    let lastError: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: [{ role: 'user', parts: contentParts }],
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: flashcardResponseSchema,
            // Generous flat ceiling — no cost to unused headroom, and a per-card formula here
            // previously under-budgeted free-plan requests below the old safe baseline.
            maxOutputTokens: 65536,
            // This is pure extraction, not reasoning — disable thinking so it can't eat into the output budget.
            thinkingConfig: { thinkingBudget: 0 },
          },
        });
        break; // success
      } catch (err) {
        lastError = err;
        if (attempt === 0) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }

    if (!response) throw lastError;

    if (response.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      console.error('Gemini response was truncated by maxOutputTokens (cardLimit:', cardLimit, ')');
    }

    const responseText = response.text;

    if (!responseText) {
      console.error('Gemini returned empty response:', JSON.stringify(response));
      return NextResponse.json({ error: 'No response received. Please try again.' }, { status: 500 });
    }

    let flashcards;
    try {
      flashcards = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Gemini response as JSON:', responseText.slice(0, 500));
      return NextResponse.json({ error: 'Failed to process the flashcards. Please try again.' }, { status: 500 });
    }

    if (!Array.isArray(flashcards)) {
      console.error('Gemini response was not an array:', typeof flashcards);
      return NextResponse.json({ error: 'Failed to create flashcards. Please try again.' }, { status: 500 });
    }

    const validFlashcards = flashcards
      .filter((card: { question?: string; answer?: string }) => card.question && card.answer)
      .slice(0, cardLimit)
      .map((card: { question: string; answer: string }, index: number) => ({
        id: `card-${index}-${Date.now()}`,
        question: card.question,
        answer: card.answer,
      }));

    // Atomic credit deduction via DB function — prevents race conditions from parallel requests
    try {
      if (creditUserId) {
        await supabaseAdmin.rpc('deduct_generation_credit', { p_user_id: creditUserId });
      }
    } catch (deductErr) {
      console.error('Failed to deduct credit after successful generation:', deductErr);
    }
    if (isAnonymous) await recordGeneration(identifier);

    // Log generation for rate limiting and cost visibility (fire-and-forget)
    supabaseAdmin
      .from('generation_log')
      .insert({
        user_id: loggedInUserId,
        identifier_hash: isAnonymous ? identifier : null,
        input_chars: generationMode === 'prompt' ? (topic?.length ?? 0) : contents.filter((c) => !c.startsWith('data:')).reduce((s, c) => s + c.length, 0),
        file_count: generationMode === 'prompt' ? 0 : contents.filter((c) => c.startsWith('data:')).length,
      })
      .then(({ error }) => { if (error) console.error('Failed to log generation:', error.message); });

    return NextResponse.json({ flashcards: validFlashcards });
  } catch (err) {
    console.error('Gemini API error:', String(err));
    if (err instanceof Error) {
      console.error('Error details:', err.message, err.stack);
    }
    return NextResponse.json({ error: 'Failed to create flashcards. Please try again later.' }, { status: 500 });
  }
}
