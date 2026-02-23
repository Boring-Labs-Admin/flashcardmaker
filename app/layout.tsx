import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Flashcard Maker - Turn Documents Into Flashcards Instantly',
  description:
    'Upload your notes, textbooks, or documents and create study flashcards instantly. Free flashcard maker for science, maths, law, biology, chemistry, and physics.',
  metadataBase: new URL('https://flashcardmaker.co.uk'),
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'Flashcard Maker - Turn Documents Into Flashcards Instantly',
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
      <body className="font-mono bg-white text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
