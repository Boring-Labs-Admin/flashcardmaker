export const DEFAULT_AFTER_LOGIN = '/dashboard';

// `next` comes from the URL, so it is attacker-controlled. Only allow same-site relative paths,
// otherwise /login?next=https://evil.com would bounce a freshly signed-in user to another site
// (an open redirect). Shared by the /auth/callback route and the login pages.
export function safeNextPath(next: string | null | undefined, origin?: string): string {
  if (!next) return DEFAULT_AFTER_LOGIN;
  // Must start with a single "/" — "//host" and "/\host" are treated as absolute URLs by browsers.
  if (!next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return DEFAULT_AFTER_LOGIN;
  try {
    const base = origin ?? 'https://flashcardmaker.invalid';
    const resolved = new URL(next, base);
    if (resolved.origin !== new URL(base).origin) return DEFAULT_AFTER_LOGIN;
    // Never loop back into the auth pages after logging in.
    if (resolved.pathname.startsWith('/login')) return DEFAULT_AFTER_LOGIN;
    return resolved.pathname + resolved.search + resolved.hash;
  } catch {
    return DEFAULT_AFTER_LOGIN;
  }
}
