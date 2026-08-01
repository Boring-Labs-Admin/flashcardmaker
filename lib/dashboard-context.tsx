'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';
import { useAuth } from '@/lib/auth-context';
import { Deck, TestOptions, ClassSummary } from '@/lib/types';
import { UserPlanData } from '@/lib/plans';

const ADMIN_EMAIL = 'admin@boringlabs.co.uk';

export type SettingsTab = 'account' | 'billing' | 'support';

interface DashboardContextType {
  decks: Deck[];
  fetching: boolean;
  classes: ClassSummary[];
  classesFetching: boolean;
  refetchClasses: () => Promise<void>;
  handleClassCreated: (cls: ClassSummary) => void;
  handleClassRemoved: (id: string) => void;
  planData: UserPlanData | null;
  isAdmin: boolean;
  paymentSuccess: boolean;
  dismissPaymentSuccess: () => void;
  checkoutLoading: string | null;
  deleteError: string | null;
  deleteLoading: boolean;
  handleDelete: (id: string) => Promise<void>;
  handleDeckUpdate: (id: string, updates: { title?: string; color?: string; classId?: string | null }) => Promise<void>;
  handleDeckSaved: (deck: Deck) => void;
  handleDeckLocalUpdate: (deck: Deck) => void;
  handleTestOptionsGenerated: (deckId: string, options: TestOptions) => void;
  handleCheckout: (productKey: string) => Promise<void>;
  handlePortal: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  isUpgradeOpen: boolean;
  setUpgradeOpen: (v: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  settingsTab: SettingsTab;
  setSettingsTab: (t: SettingsTab) => void;
  isHelpOpen: boolean;
  setHelpOpen: (v: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [decks, setDecks] = useState<Deck[]>([]);
  const [fetching, setFetching] = useState(true);
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [classesFetching, setClassesFetching] = useState(true);
  const [planData, setPlanData] = useState<UserPlanData | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isUpgradeOpen, setUpgradeOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>('account');
  const [isHelpOpen, setHelpOpen] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  // Detect ?payment=success after returning from Stripe Checkout
  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      posthog.capture('checkout_completed');
      setPaymentSuccess(true);
      setSettingsTab('billing');
      setSettingsOpen(true);
      router.replace('/dashboard');
      fetch('/api/user/plan')
        .then(r => r.json())
        .then(data => { if (!data.anonymous) setPlanData(data); })
        .catch(() => {});
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!user) return;

    // Show cached decks instantly if available, then refresh silently in background
    // Cache is keyed by user ID so switching accounts never leaks one user's decks to another
    const cacheKey = `decks_cache_${user.id}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        setDecks(JSON.parse(cached));
        setFetching(false);
      } catch { /* ignore corrupt cache */ }
    } else {
      setFetching(true);
    }

    fetch('/api/decks')
      .then(r => r.json())
      .then(data => {
        const fresh = data.decks || [];
        setDecks(fresh);
        sessionStorage.setItem(cacheKey, JSON.stringify(fresh));
      })
      .catch(() => {})
      .finally(() => setFetching(false));

    if (user.email !== ADMIN_EMAIL) {
      fetch('/api/user/plan')
        .then(r => r.json())
        .then(data => { if (!data.anonymous) setPlanData(data); })
        .catch(() => {});
    }
  }, [user]);

  const refetchClasses = useCallback(async () => {
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      setClasses(data.classes ?? []);
    } catch {
      // Non-fatal — keep whatever was already loaded
    } finally {
      setClassesFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setClassesFetching(true);
    refetchClasses();
  }, [user, refetchClasses]);

  const handleClassCreated = (cls: ClassSummary) => setClasses(prev => [cls, ...prev]);
  const handleClassRemoved = (id: string) => setClasses(prev => prev.filter(c => c.id !== id));

  // Generic full-deck replace — used by the card editor's autosave so other pages
  // (class overview, deck grid) reflect edited card counts without a full refetch.
  const handleDeckLocalUpdate = (deck: Deck) => {
    setDecks(prev => {
      const updated = prev.map(d => d.id === deck.id ? deck : d);
      if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    const res = await fetch(`/api/decks?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setDecks(prev => {
        const updated = prev.filter(d => d.id !== id);
        if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
        return updated;
      });
    } else {
      setDeleteError('Failed to delete deck. Please try again.');
    }
  };

  const handleTestOptionsGenerated = (deckId: string, options: TestOptions) => {
    setDecks(prev => {
      const updated = prev.map(d => d.id === deckId ? { ...d, test_options: options } : d);
      if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeckSaved = (deck: Deck) => {
    setDecks(prev => {
      const updated = [deck, ...prev];
      if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleCheckout = async (productKey: string) => {
    setCheckoutLoading(productKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productKey }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silently reset — user can retry
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    setCheckoutLoading('portal');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      // silently reset
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    const res = await fetch('/api/user/delete', { method: 'DELETE' });
    if (res.ok) {
      await signOut();
      router.push('/');
    } else {
      setDeleteError('Failed to delete account. Please try again or contact support@flashcardmaker.co.uk');
      setDeleteLoading(false);
    }
  };

  const handleDeckUpdate = async (id: string, updates: { title?: string; color?: string; classId?: string | null }) => {
    const res = await fetch('/api/decks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      const { deck } = await res.json();
      setDecks(prev => {
        const updated = prev.map(d => d.id === id ? deck : d);
        if (user) sessionStorage.setItem(`decks_cache_${user.id}`, JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <DashboardContext.Provider value={{
      decks,
      fetching,
      classes,
      classesFetching,
      refetchClasses,
      handleClassCreated,
      handleClassRemoved,
      planData,
      isAdmin,
      paymentSuccess,
      dismissPaymentSuccess: () => setPaymentSuccess(false),
      checkoutLoading,
      deleteError,
      deleteLoading,
      handleDelete,
      handleDeckUpdate,
      handleDeckSaved,
      handleDeckLocalUpdate,
      handleTestOptionsGenerated,
      handleCheckout,
      handlePortal,
      handleDeleteAccount,
      isUpgradeOpen,
      setUpgradeOpen,
      isSettingsOpen,
      setSettingsOpen,
      settingsTab,
      setSettingsTab,
      isHelpOpen,
      setHelpOpen,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within a DashboardProvider');
  return ctx;
}
