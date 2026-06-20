import Link from 'next/link';
import { ReactNode } from 'react';
import { Check, Library, Zap } from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  pill?: ReactNode;
  breadcrumbLabel?: string;
}

export default function Header({ title, subtitle, pill, breadcrumbLabel }: HeaderProps) {
  if (subtitle || title) {
    return (
      <div className="hero-text">
        {breadcrumbLabel && (
          <div className="breadcrumb" style={{ color: 'white' }}>
            <Link href="/" style={{ color: 'white' }}>Home</Link> / {breadcrumbLabel}
          </div>
        )}
        {pill && <div className="pill" style={{ marginBottom: '1.25rem' }}>{pill}</div>}
        <h1 className="header-title">{title}</h1>
        <p className="tagline">{subtitle}</p>
      </div>
    );
  }

  return (
    <div className="hero-text">
      <div className="pill" style={{ marginBottom: '1.25rem' }}><Zap size={13} /> Free to start · no card needed</div>
      <h1 className="header-title">
        Turn your notes into <span className="bolt-accent">flashcards</span> in seconds.
      </h1>
      <p className="header-description">
        Paste your notes, drop in a PDF or a photo of your textbook — and watch a study-ready deck appear. No typing them out. No login to start.
      </p>
      <div className="header-trust">
        <span><Check size={16} strokeWidth={2.5} /> PDFs, Word docs &amp; images</span>
        <span><Check size={16} strokeWidth={2.5} /> Flip, list &amp; test modes</span>
        <span><Check size={16} strokeWidth={2.5} /> GCSE, A-Level &amp; beyond</span>
      </div>
      <div className="header-library-cta">
        <a href="/library" className="header-library-btn"><Library size={16} /> Browse the Free Flashcard Library →</a>
      </div>
    </div>
  );
}
