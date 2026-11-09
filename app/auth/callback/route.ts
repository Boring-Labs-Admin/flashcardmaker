import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { safeNextPath } from '@/lib/authRedirect';

// Handles the return trip for Google sign-in, password-reset links and (if enabled) email
// confirmation links: exchange the one-time code for a session, then send the user on.
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const code = requestUrl.searchParams.get('code');
  // Attacker-controlled — only same-site relative paths are honoured (see lib/authRedirect).
  const next = safeNextPath(requestUrl.searchParams.get('next'), origin);
  const isRecovery = next.startsWith('/reset-password');

  const failTo = (message: string) => {
    const url = new URL('/login', origin);
    url.searchParams.set('error', message);
    return NextResponse.redirect(url);
  };

  // The provider/Supabase reports problems (user cancelled Google, expired link) as query params.
  if (requestUrl.searchParams.get('error')) {
    return failTo(isRecovery
      ? 'That password reset link has expired or was already used. Please request a new one.'
      : 'Sign-in was cancelled or failed. Please try again.');
  }

  if (!code) {
    return failTo('Sign-in failed. Please try again.');
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    // The usual cause for a reset link is opening it in a different browser from the one that
    // asked for it (the PKCE verifier lives in the original browser), or it has expired.
    return failTo(isRecovery
      ? 'That password reset link has expired, was already used, or was opened in a different browser. Please request a new one.'
      : 'Sign-in failed. Please try again.');
  }

  return NextResponse.redirect(new URL(next, origin));
}
