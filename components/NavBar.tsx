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

  const handleLoginClick = onLoginClick ?? (() => setIsModalOpen(true));

  return (
    <>
      <nav className="nav-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
      </nav>

      {!onLoginClick && (
        <FlashboardModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}