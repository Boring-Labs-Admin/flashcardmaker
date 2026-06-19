'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import posthog from 'posthog-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Client created once synchronously — always available, no null-window race
  const supabaseRef = useRef(createClientComponentClient());

  useEffect(() => {
    const supabase = supabaseRef.current;
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
        if (event === 'SIGNED_IN' && session?.user) {
          // Treat as a fresh signup if the account was created in the last minute —
          // distinguishes new signups from returning logins without a server round-trip
          const createdRecently = Date.now() - new Date(session.user.created_at).getTime() < 60_000;
          posthog.capture(createdRecently ? 'signup_completed' : 'login_completed');
        }
      });

      return () => subscription.unsubscribe();
    } catch {
      // Supabase not configured - auth is disabled
      setLoading(false);
      return () => {};
    }
  }, []);

  const signInWithGoogle = async () => {
    await supabaseRef.current.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const signOut = async () => {
    await supabaseRef.current.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
