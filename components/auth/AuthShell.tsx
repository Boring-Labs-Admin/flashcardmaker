import { Zap } from 'lucide-react';
import NavBar from '@/components/NavBar';

// Shared page chrome for /login, /forgot-password and /reset-password: site nav + centred card.
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <main>
      {/* Already on the login page, so the nav's own "Log in" button has nothing to open. */}
      <NavBar onLoginClick={() => {}} />
      <div className="auth-page">
        <div className="auth-card">
          <div className="modal-logo"><Zap size={44} strokeWidth={1.75} /></div>
          <h1 className="modal-title">{title}</h1>
          {subtitle && <p className="modal-subtitle" style={{ marginBottom: '1.5rem' }}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </main>
  );
}
