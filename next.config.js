/** @type {import('next').NextConfig} */

// Library deck slugs were renamed to `free-flashcards-for-<topic>`. Google still has the old
// URLs indexed/discovered (Search Console reported them as 404), so redirect each to its
// current equivalent. Keys are the old slugs, values the current ones (see lib/library.ts).
const LEGACY_LIBRARY_SLUGS = {
  'gcse-chemistry-atomic-structure': 'free-flashcards-for-chemistry-atomic-structure',
  'economics-supply-demand': 'free-flashcards-for-economics-supply-demand',
  'a-level-biology-dna-protein-synthesis': 'free-flashcards-for-biology-dna-protein-synthesis',
  'chemistry-periodic-table': 'free-flashcards-for-chemistry-periodic-table',
  'a-level-psychology-memory': 'free-flashcards-for-psychology-memory',
  'computer-science-data-representation': 'free-flashcards-for-computer-science-data-representation',
  'biology-genetics-evolution': 'free-flashcards-for-biology-genetics-evolution',
  'biology-nervous-system': 'free-flashcards-for-biology-nervous-system',
  'english-literature-macbeth': 'free-flashcards-for-english-literature-macbeth',
}

const nextConfig = {
  reactStrictMode: true,
  // Enable static exports for pages that don't need server-side rendering
  output: 'standalone',
  async redirects() {
    return Object.entries(LEGACY_LIBRARY_SLUGS).map(([from, to]) => ({
      source: `/library/${from}`,
      destination: `/library/${to}`,
      permanent: true,
    }))
  },
}

module.exports = nextConfig
