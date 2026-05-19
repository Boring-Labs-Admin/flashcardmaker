'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function BackLink() {
  const searchParams = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';
  return (
    <Link href={fromDashboard ? '/dashboard' : '/'} className="back-link">
      {fromDashboard ? '← Flashboard' : '← Home'}
    </Link>
  );
}
