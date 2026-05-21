import Link from 'next/link';
import { LIBRARY_DECKS } from '@/lib/library';
import { DECK_SEO } from '@/lib/library-seo';
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
  const seo = DECK_SEO[deck.slug];
  const title = seo?.metaTitle ?? `${deck.topic} Flashcards | Free ${deck.subject} Cards | Flashcard Maker`;
  const description = seo?.metaDescription ?? `Study free ${deck.topic} flashcards for ${deck.subject}. Covers key concepts and exam topics. Flip through questions and answers instantly, no signup needed.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://flashcardmaker.co.uk/library/${deck.slug}`,
    },
  };
}

const FREE_LIMIT = 10;

export default function LibraryDeckPage({ params }: { params: { slug: string } }) {
  const deck = LIBRARY_DECKS.find(d => d.slug === params.slug);
  if (!deck) notFound();

  const seo = DECK_SEO[deck.slug];
  const visibleCards = deck.cards.slice(0, FREE_LIMIT);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visibleCards.map(card => ({
      '@type': 'Question',
      name: card.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: card.answer,
      },
    })),
  };

  const SUBJECT_PAGE_SLUGS: Record<string, string> = {
    Biology: 'biology', Chemistry: 'chemistry', Physics: 'physics',
    Maths: 'maths', Psychology: 'psychology', Medicine: 'medical',
    Anatomy: 'anatomy', Nursing: 'nursing', History: 'history',
    Geography: 'geography', Economics: 'business', 'Business Studies': 'business',
  };
  const subjectSlug = SUBJECT_PAGE_SLUGS[deck.subject];
  const breadcrumbItems = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flashcardmaker.co.uk' },
    ...(subjectSlug ? [{ '@type': 'ListItem', position: 2, name: `${deck.subject} Flashcards`, item: `https://flashcardmaker.co.uk/${subjectSlug}-flashcards` }] : []),
    { '@type': 'ListItem', position: subjectSlug ? 3 : 2, name: seo?.h1 ?? deck.title, item: `https://flashcardmaker.co.uk/library/${deck.slug}` },
  ];
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const relatedDecks = LIBRARY_DECKS.filter(
    d => d.subject === deck.subject && d.slug !== deck.slug
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main>
        <NavBar />
        <LibraryDeckView deck={deck} />

        {relatedDecks.length > 0 && (
          <div className="container">
            <div className="library-related">
              <h2 className="library-related-title">More free {deck.subject} flashcards</h2>
              <div className="library-related-grid">
                {relatedDecks.map(d => (
                  <Link key={d.slug} href={`/library/${d.slug}`} className="library-related-card">
                    <span className="library-related-card-title">{d.topic}</span>
                    <span className="library-related-card-count">{d.cards.length} cards</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
