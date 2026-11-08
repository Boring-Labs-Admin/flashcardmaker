import type { MetadataRoute } from 'next';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { LIBRARY_DECKS } from '@/lib/library';

const BASE = 'https://flashcardmaker.co.uk';

// Bump this date whenever library/subject/home content meaningfully changes — Google uses
// lastModified as a recrawl hint, and a stale date tells it there is nothing new to fetch.
const CONTENT_LAST_UPDATED = new Date('2026-11-08');
const LIBRARY_UPDATED = CONTENT_LAST_UPDATED;
const SUBJECTS_UPDATED = CONTENT_LAST_UPDATED;
const HOME_UPDATED = CONTENT_LAST_UPDATED;
const STATIC_UPDATED = new Date('2025-01-01');

export default function sitemap(): MetadataRoute.Sitemap {
  const subjectEntries = [
    ...SUBJECTS.map((s) => s.href),
    // Science isn't a tile in the subject grid, but it is a real indexable landing page.
    '/science-flashcards',
  ].map((href) => ({
    url: `${BASE}${href}`,
    lastModified: SUBJECTS_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const curriculumEntries = CURRICULA.map((c) => ({
    url: `${BASE}${c.href}`,
    lastModified: SUBJECTS_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  const libraryEntries = LIBRARY_DECKS.map((d) => ({
    url: `${BASE}/library/${d.slug}`,
    lastModified: LIBRARY_UPDATED,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  return [
    {
      url: BASE,
      lastModified: HOME_UPDATED,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${BASE}/library`,
      lastModified: LIBRARY_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/pricing`,
      lastModified: SUBJECTS_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${BASE}/privacy-policy`,
      lastModified: STATIC_UPDATED,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${BASE}/terms`,
      lastModified: STATIC_UPDATED,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    ...libraryEntries,
    ...subjectEntries,
    ...curriculumEntries,
  ];
}
