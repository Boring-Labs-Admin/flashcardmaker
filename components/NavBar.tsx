'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import FlashboardModal from './FlashboardModal';
import { SUBJECTS, CURRICULA } from '@/lib/subjects';

interface NavBarProps {
  onLoginClick?: () => void;
}

export default function NavBar({ onLoginClick }: NavBarProps) {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const subjectsRef = useRef<HTMLDivElement>(null);

  const handleLoginClick = onLoginClick ?? (() => setIsModalOpen(true));

  useEffect(() => {
    if (!isAccountOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAccountOpen]);

  useEffect(() => {
    if (!isSubjectsOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (subjectsRef.current && !subjectsRef.current.contains(e.target as Node)) {
        setIsSubjectsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSubjectsOpen]);

  const displayName = user?.user_metadata?.full_name || user?.email || '';

  return (
    <>
      <nav className="nav-bar">
        <Link href="/" className="nav-logo">
          Flashcard Maker
        </Link>

        {/* Desktop buttons */}
        <div className="nav-buttons">
          <div className="nav-links">
            {/* Links stay in the DOM when closed (display:none) so crawlers still see every subject page. */}
            <div className="nav-account" ref={subjectsRef}>
              <button
                onClick={() => setIsSubjectsOpen(o => !o)}
                aria-expanded={isSubjectsOpen}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.3rem', padding: 0 }}
              >
                Subjects <ChevronDown size={14} />
              </button>
              <div
                className="nav-account-dropdown"
                style={{ display: isSubjectsOpen ? 'block' : 'none', right: 'auto', left: 0, maxHeight: '70vh', overflowY: 'auto' }}
              >
                {[...SUBJECTS, { name: 'Science Flashcards', href: '/science-flashcards' }, ...CURRICULA].map(s => (
                  <Link key={s.href} href={s.href} className="nav-account-dropdown-item" onClick={() => setIsSubjectsOpen(false)}>
                    {s.name.replace(' Flashcards', '')}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/library" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, textDecoration: 'none' }}>
              Free Library
            </Link>
            <Link href="/pricing" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, textDecoration: 'none' }}>
              Pricing
            </Link>
          </div>

          {user ? (
            <div className="nav-account" ref={accountRef}>
              <button
                className="nav-account-trigger"
                onClick={() => setIsAccountOpen(o => !o)}
              >
                <span>{displayName}</span>
                <ChevronDown size={14} />
              </button>
              {isAccountOpen && (
                <div className="nav-account-dropdown">
                  <div className="nav-account-dropdown-email">{displayName}</div>
                  <Link href="/dashboard" className="nav-account-dropdown-item" onClick={() => setIsAccountOpen(false)}>
                    My Flashboard
                  </Link>
                  <button
                    className="nav-account-dropdown-item"
                    onClick={() => { setIsAccountOpen(false); signOut(); }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="nav-login-btn" onClick={handleLoginClick}>
              Log in / Sign up
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setIsMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="nav-menu">
            {user && (
              <span className="nav-menu-username">
                {user.user_metadata?.full_name || user.email}
              </span>
            )}
            <Link href="/library" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
              Free Library
            </Link>
            <Link href="/pricing" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
            {user && (
              <Link href="/dashboard" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
                My Flashboard
              </Link>
            )}
            <button
              className="nav-login-btn"
              onClick={() => { user ? signOut() : handleLoginClick(); setIsMenuOpen(false); }}
            >
              {user ? 'Sign Out' : 'Log in / Sign up'}
            </button>
          </div>
        )}
      </nav>

      {!onLoginClick && (
        <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
