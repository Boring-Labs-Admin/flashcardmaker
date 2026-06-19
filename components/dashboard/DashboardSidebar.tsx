'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, Layers, ClipboardCheck, CalendarDays, Library, Sparkles, Settings, HelpCircle, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDashboard } from '@/lib/dashboard-context';

const NAV_ITEMS = [
  { label: 'Create Flashcards', href: '/dashboard', icon: Zap },
  { label: 'Your Flashcards', href: '/dashboard/decks', icon: Layers },
  { label: 'Test Yourself', href: '/dashboard/test', icon: ClipboardCheck },
  { label: 'Exam Calendar', href: '/dashboard/exam-calendar', icon: CalendarDays },
  { label: 'Free Library', href: '/dashboard/library', icon: Library },
];

function SidebarLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="dashboard-sidebar-nav">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === '/dashboard'
          ? pathname === '/dashboard'
          : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`dashboard-sidebar-link${isActive ? ' active' : ''}`}
            onClick={onNavigate}
          >
            <span className="dashboard-sidebar-icon"><Icon size={18} strokeWidth={2} /></span>
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
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
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
                <Sparkles size={16} /> Upgrade Plan
              </button>
              <button onClick={() => { setUserMenuOpen(false); setSettingsTab('account'); setSettingsOpen(true); }}>
                <Settings size={16} /> Settings
              </button>
              <button onClick={() => { setUserMenuOpen(false); setHelpOpen(true); }}>
                <HelpCircle size={16} /> Help
              </button>
              <div className="dashboard-user-menu-divider" />
              <button onClick={handleLogout}>
                <LogOut size={16} /> Log Out
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
