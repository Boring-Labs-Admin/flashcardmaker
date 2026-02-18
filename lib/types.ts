export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export type ViewMode = 'single' | 'side-by-side' | 'grid';

export interface GenerationResponse {
  success: boolean;
  flashcards?: Flashcard[];
  error?: string;
  blocked?: boolean;
}