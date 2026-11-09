import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

// Account pages shouldn't appear in search results (noindex, but still crawlable so Google sees the tag).
export const metadata: Metadata = {
  title: 'Log in or sign up | Flashcard Maker',
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  // LoginForm reads the URL (?next, ?reason, ?mode), which needs a Suspense boundary.
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
