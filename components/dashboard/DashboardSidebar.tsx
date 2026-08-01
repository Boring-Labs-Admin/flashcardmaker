'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, Layers, ClipboardCheck, CalendarDays, Library, Sparkles, Settings, HelpCircle, LogOut, Menu, X, Flame, BarChart3 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useDashboard } from '@/lib/dashboard-context';
import { UserStats } from '@/lib/types';
import StudyHistoryChart from './StudyHistoryChart';

const STATS_CACHE_KEY = 'user_stats_cache';
const STATS_CACHE_TTL_MS = 5 * 60 * 1000;

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
  const [stats, setStats] = useState<UserStats | null>(null);
  const [showHistoryChart, setShowHistoryChart] = useState(false);

  useEffect(() => {
    if (!user) return;

    const cached = sessionStorage.getItem(STATS_CACHE_KEY);
    if (cached) {
      try {
        const { data, cachedAt } = JSON.parse(cached);
        if (Date.now() - cachedAt < STATS_CACHE_TTL_MS) {
          setStats(data);
          return;
        }
      } catch { /* ignore corrupt cache */ }
    }

    fetch('/api/user/stats')
      .then(r => r.json())
      .then((data: UserStats) => {
        setStats(data);
        sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify({ data, cachedAt: Date.now() }));
      })
      .catch(() => {});
  }, [user]);

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

        {stats && (
          <div className="sidebar-stats-row">
            <div className="sidebar-stat">
              <span className="sidebar-stat-value"><Flame size={13} /> {stats.streak}</span>
              <span className="sidebar-stat-label">Days Streak</span>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-value">{stats.studiedToday ? '✓' : '--'}</span>
              <span className="sidebar-stat-label">Studied Today</span>
            </div>
            <div className="sidebar-stat">
              <span className="sidebar-stat-value">{stats.avgPerDay > 0 ? stats.avgPerDay : '--'}</span>
              <span className="sidebar-stat-label">Avg. Studied /Day</span>
            </div>
            <button className="sidebar-stat-chart-btn" onClick={() => setShowHistoryChart(true)} title="Study history" aria-label="View study history">
              <BarChart3 size={16} />
            </button>
          </div>
        )}

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

      {showHistoryChart && <StudyHistoryChart onClose={() => setShowHistoryChart(false)} />}
    </>
  );
}
