import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Chemistry Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create chemistry flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for chemistry revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/chemistry-flashcards' },
  openGraph: {
    title: 'Chemistry Flashcards - Create Study Cards Instantly',
    description: 'Create chemistry flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/chemistry-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chemistry Flashcards',
    description: 'Create chemistry flashcards from your notes instantly.',
  },
};

export default function ChemistryFlashcards() {
  return (
    <SubjectContent
      title="Flashcard Maker - Chemistry Flashcards"
      subtitle="Turn your chemistry notes into study cards instantly"
      topic="chemistry"
    />
  );
}
