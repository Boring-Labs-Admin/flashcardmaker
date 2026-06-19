'use client';

import { Suspense, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { DashboardProvider } from '@/lib/dashboard-context';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import UpgradePlanModal from '@/components/dashboard/UpgradePlanModal';
import SettingsModal from '@/components/dashboard/SettingsModal';
import HelpModal from '@/components/dashboard/HelpModal';

function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <DashboardProvider>
      <div className="dashboard-shell">
        <DashboardSidebar />
        <main className="dashboard-main">{children}</main>
      </div>
      <UpgradePlanModal />
      <SettingsModal />
      <HelpModal />
    </DashboardProvider>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
