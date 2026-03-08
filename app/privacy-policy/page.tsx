import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Flashcard Maker',
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'sans-serif', lineHeight: 1.7, color: '#1a1a2e' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Privacy Policy</h1>
      <p style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '2.5rem' }}>Last updated: March 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. Who We Are</h2>
        <p>Flashcard Maker (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates the website at flashcardmaker.co.uk. This policy explains what personal data we collect, how we use it, and your rights.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. Data We Collect</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li><strong>Account data:</strong> When you sign in with Google, we receive your name and email address via Google OAuth.</li>
          <li><strong>User content:</strong> Documents, notes, and files you upload to generate flashcards. Files are processed to create flashcards and are not stored permanently.</li>
          <li><strong>Saved decks:</strong> Flashcard decks you choose to save are stored securely in our database.</li>
          <li><strong>Usage data:</strong> We collect anonymised usage analytics (pages visited, features used) via PostHog to improve the product.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. How We Use Your Data</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>To provide and operate the Flashcard Maker service</li>
          <li>To save and retrieve your flashcard decks</li>
          <li>To improve the product based on how it is used</li>
          <li>To send transactional communications (e.g. account-related notifications)</li>
        </ul>
        <p>We do not sell your personal data to third parties.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>4. Third-Party Services</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li><strong>Supabase</strong> — authentication and database storage. Data is stored in the EU.</li>
          <li><strong>Google OAuth</strong> — used for account sign-in only. We do not access your Google data beyond name and email.</li>
          <li><strong>PostHog</strong> — anonymised product analytics. No personally identifiable information is shared.</li>
          <li><strong>Anthropic / OpenAI</strong> — content you submit is processed by AI APIs to generate flashcards. Please do not upload sensitive or confidential documents.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>5. Cookies</h2>
        <p>We use essential cookies to keep you signed in. Analytics cookies are used by PostHog to track anonymised usage. You can disable cookies in your browser settings, though this may affect functionality.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>6. Data Retention</h2>
        <p>Account data and saved decks are retained until you delete your account. You can request deletion of all your data at any time by contacting us.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>7. Your Rights</h2>
        <p>Under UK GDPR you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the address below.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>8. Contact</h2>
        <p>For any privacy-related questions, please email: <strong>[your contact email]</strong></p>
      </section>
    </main>
  );
}
