'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { safeNextPath } from '@/lib/authRedirect';
import AuthShell from './AuthShell';
import TurnstileWidget, { TURNSTILE_SITE_KEY } from './TurnstileWidget';

type Reason = 'save' | 'library' | 'generic';

// Same wording the old login popup used, so context-specific prompts read the same.
const SIGNUP_SUBTITLES: Record<Reason, string> = {
  save: 'Create a free account to save this deck forever — access it anytime from your Flashboard.',
  library: 'Create a free account to see every card in this deck — no payment needed.',
  generic: 'Save your decks, access them anywhere, and track your progress.',
};

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();

  const reasonParam = params.get('reason');
  const reason: Reason = reasonParam === 'save' || reasonParam === 'library' ? reasonParam : 'generic';
  const next = safeNextPath(params.get('next'));

  const modeParam = params.get('mode');
  const [mode, setMode] = useState<'signin' | 'signup'>(
    modeParam === 'signup' || (modeParam !== 'signin' && reason !== 'generic') ? 'signup' : 'signin'
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaReset, setCaptchaReset] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(params.get('error') ?? '');
  const [checkEmail, setCheckEmail] = useState(false);

  // Already signed in (or just became signed in) → go where they were headed.
  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, next, router]);

  const switchMode = (m: 'signin' | 'signup') => {
    setMode(m);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (mode === 'signup' && password.length < 8) {
      setError('Your password must be at least 8 characters.');
      return;
    }
    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setError('Please complete the verification check below.');
      return;
    }

    setSubmitting(true);
    const result = mode === 'signup'
      ? await signUpWithEmail(email, password, name, captchaToken)
      : await signInWithEmail(email, password, captchaToken);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      setCaptchaReset(n => n + 1); // captcha tokens are single-use
      return;
    }
    if (result.needsConfirmation) {
      setCheckEmail(true);
      return;
    }
    router.replace(next);
  };

  if (checkEmail) {
    return (
      <AuthShell title="Check your email" subtitle={`We've sent a confirmation link to ${email.trim()}. Click it to finish creating your account.`}>
        <button className="modal-btn secondary" onClick={() => { setCheckEmail(false); setMode('signin'); }}>
          Back to log in
        </button>
      </AuthShell>
    );
  }

  const isSignup = mode === 'signup';

  return (
    <AuthShell
      title={isSignup ? 'Create your free account' : 'Log in to your Flashboard'}
      subtitle={isSignup ? SIGNUP_SUBTITLES[reason] : 'Welcome back — pick up where you left off.'}
    >
      <button type="button" className="modal-btn secondary" onClick={() => signInWithGoogle(next)}>
        Log in / Sign up with Google
      </button>

      <div className="auth-divider"><span>or use your email</span></div>

      <form onSubmit={handleSubmit} noValidate>
        {isSignup && (
          <div className="auth-field">
            <label className="modal-field-label" htmlFor="auth-name">Your name (optional)</label>
            <input
              id="auth-name"
              className="deck-name-input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={80}
            />
          </div>
        )}

        <div className="auth-field">
          <label className="modal-field-label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            className="deck-name-input"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <label className="modal-field-label" htmlFor="auth-password">
            Password{isSignup && ' (at least 8 characters)'}
          </label>
          <div className="auth-password-wrap">
            <input
              id="auth-password"
              className="deck-name-input"
              type={showPassword ? 'text' : 'password'}
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={isSignup ? 8 : undefined}
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

        {!isSignup && (
          <div className="auth-forgot">
            <Link href="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>
        )}

        <TurnstileWidget onToken={setCaptchaToken} resetKey={captchaReset} />

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button type="submit" className="modal-btn" disabled={submitting}>
          {submitting ? (isSignup ? 'Creating account…' : 'Logging in…') : (isSignup ? 'Create account' : 'Log in')}
        </button>
      </form>

      <p className="auth-switch">
        {isSignup ? (
          <>Already have an account?{' '}<button type="button" className="auth-link" onClick={() => switchMode('signin')}>Log in</button></>
        ) : (
          <>New here?{' '}<button type="button" className="auth-link" onClick={() => switchMode('signup')}>Create a free account</button></>
        )}
      </p>
    </AuthShell>
  );
}
