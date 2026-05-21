'use client';

import { useState } from 'react';
import Link from 'next/link';
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
            {user ? 'Sign Out' : 'Login / Sign up to Your Flashboard'}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setIsMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="nav-menu">
            {user && (
              <span className="nav-menu-username">
                {user.user_metadata?.full_name || user.email}
              </span>
            )}
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
              {user ? 'Sign Out' : 'Login / Sign up to Your Flashboard'}
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
