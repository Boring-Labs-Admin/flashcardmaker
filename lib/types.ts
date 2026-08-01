export interface Flashcard {
  id: string;
  question: string;
  answer: string;

  // Advanced editor fields (Phase 4) — all optional, absent on cards created before this shipped
  questionPrompt?: string;
  questionClarifier?: string;
  questionFootnote?: string;
  answerPrompt?: string;
  answerClarifier?: string;
  answerFootnote?: string;
  questionImage?: string;
  answerImage?: string;
  questionAudio?: string;
  answerAudio?: string;
}

export type ViewMode = 'single' | 'side-by-side' | 'grid';

export interface Deck {
  id: string;
  user_id: string;
  title: string;
  topic?: string;
  flashcards: Flashcard[];
  created_at: string;
  color?: string;
  mastery_pct?: number;
  last_studied_at?: string | null;
  class_id?: string | null;
}

export type Confidence = 1 | 2 | 3 | 4 | 5;

export interface StudyQueueCard {
  index: number;
  question: string;
  answer: string;
  currentConfidence: Confidence | null;
  // Present on merged (class-level "Study All") queues, where cards come from
  // several decks — absent on single-deck queues, which imply the session's own deckId.
  deckId?: string;
  deckTitle?: string;
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

export type ClassPurpose =
  | 'job_skills'
  | 'foreign_languages'
  | 'professional_certification'
  | 'standardised_test'
  | 'school_university'
  | 'general';

export type ClassRole = 'instructor' | 'student';

export interface ClassRecord {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  purpose: ClassPurpose | null;
  role: ClassRole;
  cover_color: string;
  cover_emoji: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClassSummary extends ClassRecord {
  deckCount: number;
  totalCards: number;
  masteryPct: number;
  cardsStudied: number;
  studiedToday: boolean;
}

export interface ClassDeckSummary {
  id: string;
  title: string;
  cardCount: number;
  masteryPct: number;
  cardsStudied: number;
  color: string | null;
  lastStudiedAt: string | null;
}

export interface ClassDetail {
  class: ClassRecord;
  decks: ClassDeckSummary[];
  totalCards: number;
  masteryPct: number;
}

export type StudyMode = 'progressive' | 'random';