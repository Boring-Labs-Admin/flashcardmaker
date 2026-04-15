interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{title ?? 'Flashcard Maker'}</h1>
        <p className="tagline">
          {subtitle ? (
            <>{subtitle} <span className="bolt-accent">⚡</span></>
          ) : (
            <>Turn your documents, notes and photos into flashcards{' '}
            <span className="bolt-accent">⚡ instantly</span></>
          )}
        </p>
        {!subtitle && (
          <p className="header-library-cta">
            Or check out our{' '}
            <a href="#free-flashcards" className="header-library-btn">FREE FLASHCARD LIBRARY</a>
          </p>
        )}
      </div>
    </header>
  );
}