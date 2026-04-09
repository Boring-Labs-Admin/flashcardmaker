export interface Flashcard {
  id: string;
  question: string;
  answer: string;
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