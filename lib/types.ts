export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  // 3 plausible wrong answers generated alongside the card; absent on older decks, which fall back to random distractors in Test mode
  distractors?: string[];
  // One sentence with the key term replaced by "____"; null when the answer isn't a short clozable term
  cloze?: string | null;
  // Canonical answer (always first) plus accepted variants for typed-recall grading; absent on older decks, which fall back to [answer]
  acceptedAnswers?: string[];
}

export type ViewMode = 'single' | 'side-by-side' | 'grid';

// Keyed by card ID → exactly 3 wrong answer distractors
export type TestOptions = Record<string, [string, string, string]>;

export type TestSelectionMode = 'mcq' | 'recall';

export interface McqQuestionCard {
  type: 'mcq';
  flashcard: Flashcard;
  options: string[]; // 4 shuffled options (1 correct + 3 wrong)
  correctAnswer: string;
}

export interface TypedQuestionCard {
  type: 'typed';
  flashcard: Flashcard;
  acceptedAnswers: string[];
}

export interface ClozeQuestionCard {
  type: 'cloze';
  flashcard: Flashcard;
  clozeSentence: string;
  acceptedAnswers: string[];
}

export type TestQuestionCard = McqQuestionCard | TypedQuestionCard | ClozeQuestionCard;

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  topic?: string;
  flashcards: Flashcard[];
  created_at: string;
  color?: string;
  test_options?: TestOptions | null;
  mastery_pct?: number;
  last_studied_at?: string | null;
}

export type Confidence = 1 | 2 | 3 | 4 | 5;

export interface StudyQueueCard {
  index: number;
  question: string;
  answer: string;
  currentConfidence: Confidence | null;
}

export interface StudyQueueResponse {
  queue: StudyQueueCard[];
  totalCards: number;
  dueCards: number;
}

export interface RateCardResponse {
  success: boolean;
  masteryPct: number;
  nextReview: string | null;
}

export interface UserStats {
  streak: number;
  longestStreak: number;
  studiedToday: boolean;
  avgPerDay: number;
  totalPoints: number;
}

export interface StudyHistoryDay {
  date: string;
  sessions: number;
  cardsStudied: number;
}

export interface DeckMastery {
  masteryPct: number;
  cardsStudied: number;
  totalCards: number;
  uniqueCardsStudied: number;
  avgConfidence: number;
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