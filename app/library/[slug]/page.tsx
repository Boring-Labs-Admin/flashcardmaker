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
  return {
    title: `${deck.title} Flashcards | Flashcard Maker`,
    description: `Free ${deck.title} flashcards. Study ${deck.cards.length} key cards covering essential ${deck.topic} topics. No account needed to get started.`,
    alternates: {
      canonical: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
    openGraph: {
      title: `${deck.title} Flashcards`,
      description: `${deck.cards.length} free flashcards on ${deck.topic}.`,
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
