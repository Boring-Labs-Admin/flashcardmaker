import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'History Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create history flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for history revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/history-flashcards' },
  openGraph: {
    title: 'History Flashcards - Create Study Cards Instantly',
    description: 'Create history flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/history-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'History Flashcards',
    description: 'Create history flashcards from your notes instantly.',
  },
};

export default function HistoryFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - History Flashcards"
      subtitle="Turn your history notes into study cards instantly"
      topic="history"
    />
  );
}
