'use client';

import { Suspense, useEffect, ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { loginUrl } from '@/lib/loginUrl';
import PendingDeckSaver from '@/components/PendingDeckSaver';
import { useAuth } from '@/lib/auth-context';
import { DashboardProvider } from '@/lib/dashboard-context';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import UpgradePlanModal from '@/components/dashboard/UpgradePlanModal';
import SettingsModal from '@/components/dashboard/SettingsModal';
import HelpModal from '@/components/dashboard/HelpModal';

function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    if (!loading && !user) router.replace(loginUrl(undefined, search ? `${pathname}?${search}` : pathname));
  }, [user, loading, router, pathname, search]);

  if (loading || !user) return null;

  return (
    <DashboardProvider>
      <PendingDeckSaver />
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
