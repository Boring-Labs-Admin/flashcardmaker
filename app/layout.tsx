import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'Flashcard Maker - Turn Documents Into Flashcards Instantly',
  description:
    'Upload your notes, textbooks, or documents and create study flashcards instantly. Free flashcard maker for science, maths, law, biology, chemistry, and physics.',
  metadataBase: new URL('https://flashcardmaker.co.uk'),
  openGraph: {
    title: 'Flashcard Maker - Turn Documents Into Flashcards Instantly',
    description:
      'Upload your notes, textbooks, or documents and create study flashcards instantly.',
    url: 'https://flashcardmaker.co.uk',
    siteName: 'Flashcard Maker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flashcard Maker',
    description:
      'Turn your documents into flashcards instantly. Free flashcard maker.',
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
