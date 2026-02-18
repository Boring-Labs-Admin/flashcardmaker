import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { hashIP, checkRateLimit, recordGeneration } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  // 1. Check API key
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      {
        error:
          'Flashcard creation is not configured yet. Please add your GEMINI_API_KEY to the .env.local file.',
      },
      { status: 503 }
    );
  }

  // 2. Rate limiting via IP hash
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const identifier = hashIP(ip);

  const { allowed } = await checkRateLimit(identifier);
  if (!allowed) {
    return NextResponse.json(
      { error: "You've created your free deck for today. Come back tomorrow." },
      { status: 429 }
    );
  }

  // 3. Parse and validate request
  let rawContent: string | string[];
  let topic: string | undefined;

  try {
    const body = await request.json();
    rawContent = body.content;
    topic = body.topic;
  } catch {
    return NextResponse.json(
      { error: 'Invalid request format.' },
      { status: 400 }
    );
  }

  // Normalise to array so multi-file and single-string paths share one code path
  const contents: string[] = Array.isArray(rawContent) ? rawContent : [rawContent];

  const hasContent = contents.some(
    (c) => typeof c === 'string' && c.trim().length >= 10
  );
  if (!hasContent) {
    return NextResponse.json(
      { error: 'Please provide more content to create flashcards from (at least 10 characters).' },
      { status: 400 }
    );
  }

  // 4. Build the Gemini request
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const systemPrompt = `You are a flashcard creation expert. Create study flashcards from the provided content.

Rules:
- Create up to 30 flashcards maximum
- Each flashcard must have a clear, specific question and a concise, accurate answer
- Questions should test understanding, not just recall
- Answers should be brief but complete (1-3 sentences)
- Cover the key concepts from the content
- Return ONLY a valid JSON array of objects with "question" and "answer" fields`;

  const instructionText = topic
    ? `Create flashcards about ${topic} from the provided content.`
    : `Create flashcards from the provided content.`;

  // Build parts: each item is either an inlineData part (base64 file) or plain text
  const fileParts: object[] = [];
  const textChunks: string[] = [];

  for (const c of contents) {
    if (typeof c === 'string' && c.startsWith('data:')) {
      // File upload: "data:<mimeType>;base64,<data>"
      const commaIndex = c.indexOf(',');
      const header = c.slice(0, commaIndex);
      const base64Data = c.slice(commaIndex + 1);
      const mimeType = header.split(':')[1].split(';')[0];
      fileParts.push({ inlineData: { mimeType, data: base64Data } });
    } else if (typeof c === 'string' && c.trim().length > 0) {
      textChunks.push(c);
    }
  }

  let contentParts: object[];
  if (fileParts.length > 0) {
    // One or more file uploads (images, PDFs, etc.)
    contentParts = [
      ...fileParts,
      ...(textChunks.length > 0 ? [{ text: textChunks.join('\n\n') }] : []),
      { text: instructionText },
    ];
  } else {
    // Pure text paste
    contentParts = [
      { text: `${instructionText}\n\n${textChunks.join('\n\n')}` },
    ];
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-lite',
      contents: [{ role: 'user', parts: contentParts }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text;

    if (!responseText) {
      console.error('Gemini returned empty response:', JSON.stringify(response));
      return NextResponse.json(
        { error: 'No response received. Please try again.' },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let flashcards;
    try {
      flashcards = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        flashcards = JSON.parse(jsonMatch[0]);
      } else {
        console.error('Failed to parse Gemini response as JSON:', responseText.slice(0, 500));
        return NextResponse.json(
          { error: 'Failed to process the flashcards. Please try again.' },
          { status: 500 }
        );
      }
    }

    if (!Array.isArray(flashcards)) {
      console.error('Gemini response was not an array:', typeof flashcards);
      return NextResponse.json(
        { error: 'Failed to create flashcards. Please try again.' },
        { status: 500 }
      );
    }

    const validFlashcards = flashcards
      .filter(
        (card: { question?: string; answer?: string }) =>
          card.question && card.answer
      )
      .slice(0, 30)
      .map((card: { question: string; answer: string }, index: number) => ({
        id: `card-${index}-${Date.now()}`,
        question: card.question,
        answer: card.answer,
      }));

    // 5. Record the generation
    await recordGeneration(identifier);

    return NextResponse.json({ flashcards: validFlashcards });
  } catch (err) {
    console.error('Gemini API error:', String(err));
    if (err instanceof Error) {
      console.error('Error details:', err.message, err.stack);
    }
    return NextResponse.json(
      { error: 'Failed to create flashcards. Please try again later.' },
      { status: 500 }
    );
  }
}
