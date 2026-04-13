import type { MetadataRoute } from 'next';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';
import { LIBRARY_DECKS } from '@/lib/library';

const BASE = 'https://flashcardmaker.co.uk';

const LIBRARY_UPDATED = new Date('2026-04-13');
const SUBJECTS_UPDATED = new Date('2026-04-13');
const HOME_UPDATED = new Date('2026-04-13');
const STATIC_UPDATED = new Date('2025-01-01');

export default function sitemap(): MetadataRoute.Sitemap {
  const subjectEntries = SUBJECTS.map((s) => ({
    url: `${BASE}${s.href}`,
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
