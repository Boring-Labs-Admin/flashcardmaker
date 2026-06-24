export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  // 3 plausible wrong answers generated alongside the card; absent on older decks, which fall back to random distractors in Test mode
  distractors?: string[];
}

export type ViewMode = 'single' | 'side-by-side' | 'grid';

// Keyed by card ID → exactly 3 wrong answer distractors
export type TestOptions = Record<string, [string, string, string]>;

export interface TestCard {
  flashcard: Flashcard;
  options: string[]; // 4 shuffled options (1 correct + 3 wrong)
  correctAnswer: string;
}

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  topic?: string;
  flashcards: Flashcard[];
  created_at: string;
  color?: string;
  test_options?: TestOptions | null;
}

export interface GenerationResponse {
  success: boolean;
  flashcards?: Flashcard[];
  error?: string;
  blocked?: boolean;
}

export interface ExamDate {
  id: string;
  user_id: string;
  title: string;
  subject?: string;
  exam_date: string; // ISO date, e.g. "2026-06-12"
  notes?: string;
  created_at: string;
}