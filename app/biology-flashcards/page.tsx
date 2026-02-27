import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Biology Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create biology flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for biology revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/biology-flashcards' },
  openGraph: {
    title: 'Biology Flashcards - Create Study Cards Instantly',
    description: 'Create biology flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/biology-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biology Flashcards',
    description: 'Create biology flashcards from your notes instantly.',
  },
};

export default function BiologyFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - Biology Flashcards"
      subtitle="Turn your biology notes into study cards instantly"
      topic="biology"
    />
  );
}
