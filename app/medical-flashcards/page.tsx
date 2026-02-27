import type { Metadata } from 'next';
import SubjectContent from '@/components/SubjectContent';

export const metadata: Metadata = {
  title: 'Medical Flashcards - Create Study Cards Instantly | Flashcard Maker',
  description:
    'Create medical flashcards from your notes and textbooks instantly. AI-powered free flashcard maker for medical revision. Upload documents and get your deck in seconds.',
  alternates: { canonical: 'https://flashcardmaker.co.uk/medical-flashcards' },
  openGraph: {
    title: 'Medical Flashcards - Create Study Cards Instantly',
    description: 'Create medical flashcards from your notes and textbooks instantly.',
    url: 'https://flashcardmaker.co.uk/medical-flashcards',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Flashcards',
    description: 'Create medical flashcards from your notes instantly.',
  },
};

export default function MedicalFlashcards() {
  return (
    <SubjectContent
      title="Medical Flashcards"
      subtitle="Turn your medical notes into study cards instantly"
      topic="medicine"
    />
  );
}
