import { Suspense } from 'react';
import { LIBRARY_DECKS } from '@/lib/library';
import LibraryDeckView from '@/components/LibraryDeckView';
import NavBar from '@/components/NavBar';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return LIBRARY_DECKS.map(d => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const deck = LIBRARY_DECKS.find(d => d.slug === params.slug);
  if (!deck) return {};
  const description = `Study ${deck.cards.length} free ${deck.topic} flashcards for ${deck.subject}. Covers key concepts and exam topics — flip through questions and answers instantly, no signup needed.`;
  return {
    title: `${deck.topic} Flashcards — ${deck.cards.length} Free ${deck.subject} Cards | Flashcard Maker`,
    description,
    alternates: {
      canonical: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
    openGraph: {
      title: `${deck.topic} Flashcards — ${deck.cards.length} Free ${deck.subject} Cards | Flashcard Maker`,
      description,
      url: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
  };
}

export default function LibraryDeckPage({ params }: { params: { slug: string } }) {
  const deck = LIBRARY_DECKS.find(d => d.slug === params.slug);
  if (!deck) notFound();

  return (
    <main>
      <NavBar />
      <Suspense>
        <LibraryDeckView deck={deck} />
      </Suspense>
    </main>
  );
}
