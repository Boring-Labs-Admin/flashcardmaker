'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const ADSENSE_CLIENT = 'ca-pub-5558361880956706';

// Pages where ads (and Google's consent message, which rides on this script) must not load:
// anything behind a login, and the account forms themselves.
const NO_ADS_PREFIXES = ['/dashboard', '/login', '/forgot-password', '/reset-password', '/auth', '/coming-soon'];

export default function AdSenseScript() {
  const pathname = usePathname() ?? '';
  if (NO_ADS_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'))) return null;

  return (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
