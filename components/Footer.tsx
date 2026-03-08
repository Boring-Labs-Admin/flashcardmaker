import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <span className="site-footer-copy">© {new Date().getFullYear()} Flashcard Maker</span>
      <div className="site-footer-links">
        <Link href="/privacy-policy" className="site-footer-link">Privacy Policy</Link>
        <Link href="/terms" className="site-footer-link">Terms of Service</Link>
      </div>
    </footer>
  );
}
