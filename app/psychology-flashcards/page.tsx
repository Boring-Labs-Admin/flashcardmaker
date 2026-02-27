import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Psychology Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create psychology flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for psychology revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/psychology-flashcards' },
  openGraph: {
    title: 'Psychology Flashcards - Create Study Cards Instantly',
    description: 'Create psychology flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/psychology-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psychology Flashcards',
    description: 'Create psychology flashcards from your notes instantly.',
  },
};

export default function PsychologyFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - Psychology Flashcards"
      subtitle="Turn your psychology notes into study cards instantly"
      topic="psychology"
    />
  );
}
