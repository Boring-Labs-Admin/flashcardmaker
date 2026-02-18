interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <svg className="logo" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <circle cx="256" cy="256" r="256" fill="#004aad"/>
            <rect x="120" y="120" width="160" height="220" rx="15" fill="white" transform="rotate(-10 200 230)"/>
            <rect x="140" y="110" width="160" height="220" rx="15" fill="white" stroke="#004aad" strokeWidth="4" transform="rotate(-5 220 220)"/>
            <rect x="160" y="100" width="160" height="220" rx="15" fill="white" stroke="#004aad" strokeWidth="4"/>
            <path d="M280 140 L240 220 L270 220 L240 300 L300 210 L270 210 Z" fill="#ffe75b" stroke="#e6d35e" strokeWidth="3"/>
          </svg>
          <h1>{title ?? 'Flashcard Maker'}</h1>
        </div>
        <p className="tagline">
          {subtitle ? (
            <>{subtitle} <span className="bolt-accent">⚡</span></>
          ) : (
            <>Turn your documents, notes and photos into flashcards{' '}
            <span className="bolt-accent">⚡ instantly</span></>
          )}
        </p>
      </div>
    </header>
  );
}