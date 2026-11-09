'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const ADSENSE_CLIENT = 'ca-pub-5558361880956706';
const SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;

// Pages where ads (and Google's consent message, which rides on this script) must not load:
// anything behind a login, and the account forms themselves.
const NO_ADS_PREFIXES = ['/dashboard', '/login', '/forgot-password', '/reset-password', '/auth', '/coming-soon'];

// Added to <head> by hand rather than with next/script: next/script stamps a data-nscript attribute
// on the tag, which Google's script rejects ("AdSense head tag doesn't support data-nscript").
export default function AdSenseScript() {
  const pathname = usePathname() ?? '';
  const blocked = NO_ADS_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));

  useEffect(() => {
    if (blocked) return;
    if (document.querySelector(`script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`)) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = SCRIPT_SRC;
    s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }, [blocked]);

  return null;
}
