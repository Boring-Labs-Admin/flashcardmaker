'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import AuthShell from './AuthShell';

// Reached from the emailed link: /auth/callback has already exchanged the code for a session,
// so by the time this renders the user is signed in and can set a new password.
export default function ResetPasswordForm() {
  const router = useRouter();
  const { user, loading, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => router.replace('/dashboard'), 1500);
    return () => clearTimeout(t);
  }, [done, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError("Those passwords don't match.");
      return;
    }

    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setDone(true);
  };

  if (loading) {
    return <AuthShell title="One moment…" subtitle="Checking your reset link." />;
  }

  if (!user) {
    return (
      <AuthShell
        title="Link expired"
        subtitle="This password reset link has expired, was already used, or was opened in a different browser."
      >
        <Link href="/forgot-password" className="modal-btn" style={{ display: 'block', textDecoration: 'none' }}>
          Request a new link
        </Link>
      </AuthShell>
    );
  }

  if (done) {
    return <AuthShell title="Password updated" subtitle="Taking you to your Flashboard…" />;
  }

  return (
    <AuthShell title="Choose a new password" subtitle="Pick something at least 8 characters long.">
      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="modal-field-label" htmlFor="reset-password">New password</label>
          <div className="auth-password-wrap">
            <input
              id="reset-password"
              className="deck-name-input"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="auth-field">
          <label className="modal-field-label" htmlFor="reset-confirm">Confirm new password</label>
          <input
            id="reset-confirm"
            className="deck-name-input"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button type="submit" className="modal-btn" disabled={submitting}>
          {submitting ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </AuthShell>
  );
}
