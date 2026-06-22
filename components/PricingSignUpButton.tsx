'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import FlashboardModal from '@/components/FlashboardModal';
import Link from 'next/link';

export default function PricingSignUpButton() {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  if (user) {
    // Already inside the dashboard — "Go to Flashboard" would link to the page you're already on
    if (pathname?.startsWith('/dashboard')) {
      return (
        <div className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem', cursor: 'default' }}>
          ✓ You&apos;re signed up
        </div>
      );
    }
    return (
      <Link href="/dashboard" className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem' }}>
        Go to Flashboard →
      </Link>
    );
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem' }}>
        Get started free
      </button>
      <FlashboardModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
