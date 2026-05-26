import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-footer-copy">© {new Date().getFullYear()} Flashcard Maker</span>
      <div className="site-footer-social">
        <a href="https://www.instagram.com/flashcardmaker/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="site-footer-social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <circle cx="12" cy="12" r="4"/>
            <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
          </svg>
        </a>
        <a href="https://www.tiktok.com/@flashcardmaker.app" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="site-footer-social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
          </svg>
        </a>
        <a href="https://x.com/flashcardmaker" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="site-footer-social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L2.25 2.25h6.865l4.258 5.626 4.871-5.626zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
          </svg>
        </a>
      </div>
      <div className="site-footer-links">
        <Link href="/privacy-policy" className="site-footer-link">Privacy Policy</Link>
        <Link href="/terms" className="site-footer-link">Terms of Service</Link>
      </div>
    </footer>
  );
}
