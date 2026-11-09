'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import AuthShell from './AuthShell';
import TurnstileWidget, { TURNSTILE_SITE_KEY } from './TurnstileWidget';

export default function ForgotPasswordForm() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setError('Please complete the verification check below.');
      return;
    }

    setSubmitting(true);
    const result = await sendPasswordReset(email, captchaToken);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      setCaptchaReset(n => n + 1);
      return;
    }
    setSent(true);
  };

  if (sent) {
    // Deliberately the same message whether or not the address has an account, so this page
    // can't be used to find out who has registered.
    return (
      <AuthShell
        title="Check your email"
        subtitle={`If an account exists for ${email.trim()}, we've sent a link to reset your password. It can take a minute to arrive — check your spam folder too.`}
      >
        <Link href="/login" className="modal-btn secondary" style={{ display: 'block', textDecoration: 'none' }}>
          Back to log in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset your password" subtitle="Enter your email and we'll send you a link to choose a new password.">
      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label className="modal-field-label" htmlFor="forgot-email">Email</label>
          <input
            id="forgot-email"
            className="deck-name-input"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <TurnstileWidget onToken={setCaptchaToken} resetKey={captchaReset} />

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button type="submit" className="modal-btn" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="auth-switch">
        <Link href="/login" className="auth-link">Back to log in</Link>
      </p>
    </AuthShell>
  );
}
