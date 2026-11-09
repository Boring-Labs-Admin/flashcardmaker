export type LoginReason = 'save' | 'library' | 'generic';

// Builds the link to the dedicated login page. `next` is where to send the user after they sign in
// (the login page validates it again, so only same-site paths are ever followed).
export function loginUrl(reason?: LoginReason, next?: string): string {
  const params = new URLSearchParams();
  if (reason && reason !== 'generic') params.set('reason', reason);
  if (next) params.set('next', next);
  const qs = params.toString();
  return qs ? `/login?${qs}` : '/login';
}
