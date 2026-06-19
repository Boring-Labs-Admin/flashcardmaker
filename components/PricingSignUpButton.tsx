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
        <div style={{ display: 'block', textAlign: 'center', background: '#EEF4FF', color: '#004AAD', border: '2px solid #004AAD', borderRadius: 8, padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          ✓ You're signed up
        </div>
      );
    }
    return (
      <Link
        href="/dashboard"
        style={{ display: 'block', textAlign: 'center', background: '#EEF4FF', color: '#004AAD', border: '2px solid #004AAD', borderRadius: 8, padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', marginBottom: '1.5rem' }}
      >
        Go to Flashboard →
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{ display: 'block', width: '100%', textAlign: 'center', background: '#EEF4FF', color: '#004AAD', border: '2px solid #004AAD', borderRadius: 8, padding: '0.6rem 1rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', marginBottom: '1.5rem' }}
      >
        Get started free
      </button>
      <FlashboardModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
