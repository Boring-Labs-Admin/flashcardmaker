'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import FlashboardModal from './FlashboardModal';

interface NavBarProps {
  onLoginClick?: () => void;
}

export default function NavBar({ onLoginClick }: NavBarProps) {
  const { user, signOut } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLoginClick = onLoginClick ?? (() => setIsModalOpen(true));

  return (
    <>
      <nav className="nav-bar">
        <Link href="/" className="nav-logo">
          Flashcard Maker
        </Link>

        {/* Desktop buttons */}
        <div className="nav-buttons">
          <Link href="/" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, textDecoration: 'none' }}>
            Make flashcards
          </Link>
          <Link href="/library" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, textDecoration: 'none' }}>
            Free Library
          </Link>
          <Link href="/#subjects" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, textDecoration: 'none' }}>
            Subjects
          </Link>
          <Link href="/pricing" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600, opacity: 0.8, textDecoration: 'none' }}>
            Pricing
          </Link>
          {user && (
            <>
              <span style={{ color: 'white', fontSize: '0.85rem', opacity: 0.8 }}>
                {user.user_metadata?.full_name || user.email}
              </span>
              <Link href="/dashboard" className="nav-login-btn">
                My Flashboard
              </Link>
            </>
          )}
          <button
            className="nav-login-btn"
            onClick={user ? signOut : handleLoginClick}
          >
            {user ? 'Sign Out' : 'Log in / Sign up'}
          </button>
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
            <Link href="/" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
              Make flashcards
            </Link>
            <Link href="/library" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
              Free Library
            </Link>
            <Link href="/#subjects" className="nav-login-btn" onClick={() => setIsMenuOpen(false)}>
              Subjects
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
