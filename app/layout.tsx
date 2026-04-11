import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import 'katex/dist/katex.min.css';
import { Suspense } from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { PostHogProvider } from './providers';
import { PostHogPageview } from './posthog-pageview';
import Footer from '@/components/Footer';
import ScrollRevealInit from '@/components/ScrollRevealInit';

export const metadata: Metadata = {
  title: 'Flashcard Maker - Generate flashcards and revise for free',
  description:
    'Upload your notes, textbooks, or documents and create study flashcards instantly. Free AI flashcard maker for GCSE, A-Level, science, biology, chemistry, physics, maths, psychology, and more.',
  metadataBase: new URL('https://flashcardmaker.co.uk'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Flashcard Maker - Generate flashcards and revise for free',
    description:
      'Upload your notes, textbooks, or documents and create study flashcards instantly.',
    url: 'https://flashcardmaker.co.uk',
    siteName: 'Flashcard Maker',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Flashcard Maker — Turn documents into study cards instantly',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flashcard Maker',
    description: 'Turn your documents into flashcards instantly. Free flashcard maker.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GoogleAnalytics gaId="G-F10E8QHNE4" />
      <body className="font-mono bg-white text-gray-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Flashcard Maker',
              url: 'https://flashcardmaker.co.uk',
            }),
          }}
        />
        <PostHogProvider>
          <AuthProvider>
            <Suspense>
              <PostHogPageview />
            </Suspense>
            <ScrollRevealInit />
            {children}
            <Footer />
          </AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
