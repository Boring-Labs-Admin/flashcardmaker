'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useDashboard } from '@/lib/dashboard-context';

const NAV_ITEMS = [
  { label: 'Create Flashcards', href: '/dashboard', icon: '⚡' },
  { label: 'Your Flashcards', href: '/dashboard/decks', icon: '📚' },
  { label: 'Test Yourself', href: '/dashboard/test', icon: '📝' },
  { label: 'Exam Calendar', href: '/dashboard/exam-calendar', icon: '📅' },
  { label: 'Free Library', href: '/dashboard/library', icon: '🌐' },
];

function SidebarLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="dashboard-sidebar-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === '/dashboard'
          ? pathname === '/dashboard'
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`dashboard-sidebar-link${isActive ? ' active' : ''}`}
            onClick={onNavigate}
          >
            <span className="dashboard-sidebar-icon">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const { setUpgradeOpen, setSettingsOpen, setSettingsTab, setHelpOpen } = useDashboard();
  const pathname = usePathname();
  const router = useRouter();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.user_metadata?.full_name || user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await signOut();
    router.push('/');
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="dashboard-mobile-bar">
        <button
          className="dashboard-mobile-hamburger"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {isMobileOpen ? '✕' : '☰'}
        </button>
        <Link href="/" className="dashboard-mobile-logo">Flashcard Maker</Link>
      </div>

      {isMobileOpen && (
        <div className="dashboard-mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`dashboard-sidebar${isMobileOpen ? ' open' : ''}`}>
        <div className="dashboard-sidebar-logo">Flashcard Maker</div>

        <SidebarLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />

        <div className="dashboard-sidebar-user">
          {isUserMenuOpen && (
            <div className="dashboard-user-menu">
              <button onClick={() => { setUserMenuOpen(false); setUpgradeOpen(true); }}>
                ⚡ Upgrade Plan
              </button>
              <button onClick={() => { setUserMenuOpen(false); setSettingsTab('account'); setSettingsOpen(true); }}>
                ⚙️ Settings
              </button>
              <button onClick={() => { setUserMenuOpen(false); setHelpOpen(true); }}>
                ❓ Help
              </button>
              <div className="dashboard-user-menu-divider" />
              <button onClick={handleLogout}>
                ↩ Log Out
              </button>
            </div>
          )}
          <button className="dashboard-sidebar-user-btn" onClick={() => setUserMenuOpen(o => !o)}>
            <span className="dashboard-sidebar-avatar">{initial}</span>
            <span className="dashboard-sidebar-username">{displayName}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
