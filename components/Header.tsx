interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  if (subtitle || title) {
    return (
      <header className="header">
        <div className="header-content">
          <h1 className="header-title">{title ?? 'Flashcard Maker'}</h1>
          <p className="tagline">
            {subtitle} <span className="bolt-accent">⚡</span>
          </p>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          Free Flashcard Maker <span className="bolt-accent">⚡</span> for Students
        </h1>
        <p className="header-description">
          Upload your notes, paste your text or generate from any topic — get a full revision deck in seconds.
          No manual typing. No signup needed.
        </p>
        <div className="header-trust">
          <span>✓ Free to use</span>
          <span>✓ Works with PDFs, Word docs and images</span>
          <span>✓ GCSE, A Level and beyond</span>
        </div>
        <div className="header-library-cta">
          <a href="/library" className="header-library-btn">📚 Browse the Free Flashcard Library →</a>
        </div>
      </div>
    </header>
  );
}
