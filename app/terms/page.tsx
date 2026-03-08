import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Terms of Service — Flashcard Maker',
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <>
      <NavBar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'sans-serif', lineHeight: 1.7, color: '#1a1a2e' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Terms of Service</h1>
      <p style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '2.5rem' }}>Last updated: March 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. Acceptance of Terms</h2>
        <p>By accessing or using Flashcard Maker at flashcardmaker.co.uk (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. Description of Service</h2>
        <p>Flashcard Maker is an AI-powered tool that converts uploaded documents, notes, and other content into study flashcards. A free tier is available; premium features may require a paid subscription.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. User Accounts</h2>
        <p>To save flashcard decks you must create an account via Google sign-in. You are responsible for maintaining the security of your account and for all activity that occurs under it.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>Upload illegal, harmful, or infringing content</li>
          <li>Attempt to reverse-engineer or exploit the Service</li>
          <li>Use the Service for automated scraping or bulk generation without permission</li>
          <li>Upload content that contains personal data of third parties without their consent</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>5. Intellectual Property</h2>
        <p>The Flashcard Maker platform, branding, and code are owned by us. Flashcards you generate from your own content remain yours. You grant us a limited licence to process your uploaded content solely to provide the Service.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>6. Disclaimer of Warranties</h2>
        <p>The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not guarantee that AI-generated flashcards will be accurate, complete, or error-free. Always verify content before relying on it for exams or academic work.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>7. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, Flashcard Maker shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>8. Changes to Terms</h2>
        <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the updated terms.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>9. Governing Law</h2>
        <p>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>10. Contact</h2>
        <p>For any questions about these terms, please email: <strong>support@flashcardmaker.co.uk</strong></p>
      </section>
    </main>
    </>
  );
}
