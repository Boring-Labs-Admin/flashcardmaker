export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export type ViewMode = 'single' | 'side-by-side' | 'grid';

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  topic?: string;
  flashcards: Flashcard[];
  created_at: string;
}

export interface GenerationResponse {
  success: boolean;
  flashcards?: Flashcard[];
  error?: string;
  blocked?: boolean;
}