'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User, AuthError } from '@supabase/supabase-js';
import posthog from 'posthog-js';
import { safeNextPath } from '@/lib/authRedirect';

export interface AuthResult {
  // Human-readable message, or null on success.
  error: string | null;
  // True when sign-up succeeded but no session was issued because the project requires email
  // confirmation — the UI shows "check your email" instead of continuing.
  needsConfirmation?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: (next?: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string, captchaToken?: string | null) => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string, captchaToken?: string | null) => Promise<AuthResult>;
  sendPasswordReset: (email: string, captchaToken?: string | null) => Promise<AuthResult>;
  updatePassword: (newPassword: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const notReady = async (): Promise<AuthResult> => ({ error: 'Authentication is not available right now.' });

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signUpWithEmail: notReady,
  signInWithEmail: notReady,
  sendPasswordReset: notReady,
  updatePassword: notReady,
  signOut: async () => {},
});

// Supabase's messages are developer-facing; map the common ones to something a student can act on.
function friendlyAuthError(error: AuthError | { message: string }): string {
  const message = error.message.toLowerCase();
  if (message.includes('invalid login credentials')) return 'Incorrect email or password.';
  if (message.includes('already registered') || message.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (message.includes('captcha')) return 'Please complete the verification check and try again.';
  if (message.includes('rate limit') || message.includes('too many') || message.includes('security purposes')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (message.includes('password') && (message.includes('at least') || message.includes('weak') || message.includes('short'))) {
    return 'Please choose a stronger password (at least 8 characters).';
  }
  if (message.includes('same password') || message.includes('different from the old')) {
    return 'Your new password must be different from your old one.';
  }
  if (message.includes('invalid email') || message.includes('valid email')) return 'Please enter a valid email address.';
  if (message.includes('not confirmed')) return 'Please confirm your email address first — check your inbox for the link.';
  if (message.includes('network') || message.includes('fetch')) return 'Could not connect. Please check your internet connection.';
  return 'Something went wrong. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Client created once synchronously — always available, no null-window race
  const supabaseRef = useRef(createClientComponentClient());
  // Set while an email sign-up is in flight so the listener below doesn't double-count it.
  const signupInFlightRef = useRef(false);

  useEffect(() => {
    const supabase = supabaseRef.current;
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        if (event === 'INITIAL_SESSION') {
          setLoading(false);
        }
        if (event === 'SIGNED_IN' && session?.user && !signupInFlightRef.current) {
          // Treat as a fresh signup if the account was created in the last minute —
          // distinguishes new signups from returning logins without a server round-trip.
          // (Email sign-ups are tracked explicitly in signUpWithEmail.)
          const createdRecently = Date.now() - new Date(session.user.created_at).getTime() < 60_000;
          posthog.capture(createdRecently ? 'signup_completed' : 'login_completed', {
            method: session.user.app_metadata?.provider ?? 'unknown',
          });
        }
      });

      return () => subscription.unsubscribe();
    } catch {
      // Supabase not configured - auth is disabled
      setLoading(false);
      return () => {};
    }
  }, []);

  const callbackUrl = (next?: string) => {
    const safe = safeNextPath(next, window.location.origin);
    return `${window.location.origin}/auth/callback?next=${encodeURIComponent(safe)}`;
  };

  // `next` is only honoured when it is a string — callers sometimes pass this straight to
  // onClick, which would hand us a click event.
  const signInWithGoogle = async (next?: string) => {
    await supabaseRef.current.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: callbackUrl(typeof next === 'string' ? next : undefined),
      },
    });
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, captchaToken?: string | null): Promise<AuthResult> => {
    signupInFlightRef.current = true;
    try {
      const { data, error } = await supabaseRef.current.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: fullName.trim() ? { full_name: fullName.trim() } : undefined,
          emailRedirectTo: callbackUrl(),
          captchaToken: captchaToken ?? undefined,
        },
      });
      if (error) return { error: friendlyAuthError(error) };

      // Supabase returns a user but no session when email confirmation is required.
      if (!data.session) {
        posthog.capture('signup_pending_confirmation', { method: 'email' });
        return { error: null, needsConfirmation: true };
      }
      posthog.capture('signup_completed', { method: 'email' });
      return { error: null };
    } catch (err) {
      return { error: friendlyAuthError(err instanceof Error ? err : { message: 'network' }) };
    } finally {
      // Leave the flag up briefly: the SIGNED_IN event can arrive just after signUp resolves.
      setTimeout(() => { signupInFlightRef.current = false; }, 2000);
    }
  };

  const signInWithEmail = async (email: string, password: string, captchaToken?: string | null): Promise<AuthResult> => {
    try {
      const { error } = await supabaseRef.current.auth.signInWithPassword({
        email: email.trim(),
        password,
        options: { captchaToken: captchaToken ?? undefined },
      });
      return { error: error ? friendlyAuthError(error) : null };
    } catch (err) {
      return { error: friendlyAuthError(err instanceof Error ? err : { message: 'network' }) };
    }
  };

  const sendPasswordReset = async (email: string, captchaToken?: string | null): Promise<AuthResult> => {
    try {
      const { error } = await supabaseRef.current.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: callbackUrl('/reset-password'),
        captchaToken: captchaToken ?? undefined,
      });
      return { error: error ? friendlyAuthError(error) : null };
    } catch (err) {
      return { error: friendlyAuthError(err instanceof Error ? err : { message: 'network' }) };
    }
  };

  const updatePassword = async (newPassword: string): Promise<AuthResult> => {
    try {
      const { error } = await supabaseRef.current.auth.updateUser({ password: newPassword });
      return { error: error ? friendlyAuthError(error) : null };
    } catch (err) {
      return { error: friendlyAuthError(err instanceof Error ? err : { message: 'network' }) };
    }
  };

  const signOut = async () => {
    await supabaseRef.current.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, sendPasswordReset, updatePassword, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
