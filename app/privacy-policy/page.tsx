import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Privacy Policy — Flashcard Maker',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <NavBar />
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem', fontFamily: 'sans-serif', lineHeight: 1.7, color: '#1a1a2e' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Privacy Policy</h1>
      <p style={{ opacity: 0.5, fontSize: '0.9rem', marginBottom: '2.5rem' }}>Last updated: November 2026</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>1. Who We Are</h2>
        <p>Flashcard Maker (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is operated by Boring Labs and runs the website at flashcardmaker.co.uk. This policy explains what personal data we collect, how we use it, who we share it with, and your rights under UK GDPR.</p>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>2. Data We Collect</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li><strong>Account data:</strong> If you sign in with Google, we receive your name and email address. If you create an account with email, we collect your email address, an optional name and a password. Passwords are stored only in hashed form and we cannot read them.</li>
          <li><strong>User content:</strong> Text, documents and files you submit to generate flashcards. They are sent to our AI provider to create your cards and are not kept after processing unless you save the resulting deck.</li>
          <li><strong>Saved decks and study data:</strong> Decks you save, your confidence ratings, study sessions, streaks and exam dates are stored in our database.</li>
          <li><strong>Usage data:</strong> Pages visited, features used and device and browser information, collected by analytics tools (see Cookies below).</li>
          <li><strong>Technical data:</strong> Your IP address is used to prevent abuse of the free service. We store a one-way hashed version of it alongside usage limits, not the address itself.</li>
          <li><strong>Payment data:</strong> If you buy a paid plan, payment is handled by Stripe. We do not see or store your card details.</li>
        </ul>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>3. How We Use Your Data</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li>To provide and operate the Flashcard Maker service and keep you signed in</li>
          <li>To save and retrieve your flashcard decks and study progress</li>
          <li>To send account emails such as password resets</li>
          <li>To prevent abuse and enforce fair-use limits</li>
          <li>To understand how the product is used and improve it</li>
          <li>To show advertising on public pages of the site, where you have agreed to it</li>
        </ul>
        <p>We do not sell your personal data.</p>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>4. Third-Party Services</h2>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li><strong>Supabase</strong> &mdash; authentication and database storage.</li>
          <li><strong>Google</strong> &mdash; Google sign-in, and the Google Gemini AI service, which processes content you submit in order to generate flashcards. Please do not submit sensitive or confidential documents.</li>
          <li><strong>Resend</strong> &mdash; delivers account emails such as password resets.</li>
          <li><strong>Cloudflare Turnstile</strong> &mdash; a bot check on sign-up and sign-in forms. It may read limited information from your browser to tell people from automated scripts.</li>
          <li><strong>Stripe</strong> &mdash; payment processing for paid plans.</li>
          <li><strong>Google Analytics and PostHog</strong> &mdash; product and website analytics.</li>
          <li><strong>Google AdSense</strong> &mdash; advertising on public pages. Google and its partners may use cookies to show and measure ads, and to personalise them if you consent. See <a href="https://policies.google.com/technologies/ads" style={{ textDecoration: 'underline' }}>how Google uses data from sites that use its services</a>.</li>
        </ul>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>5. Cookies</h2>
        <p>We use these types of cookies and similar technologies:</p>
        <ul style={{ paddingLeft: '1.5rem' }}>
          <li><strong>Essential:</strong> keep you signed in and protect forms from bots. These do not need consent.</li>
          <li><strong>Analytics:</strong> Google Analytics and PostHog help us see how the site is used.</li>
          <li><strong>Advertising:</strong> Google AdSense uses cookies to show and measure ads.</li>
        </ul>
        <p>Where the law requires it, we ask for your consent before using analytics and advertising cookies, and you can change your choice at any time. You can also block or delete cookies in your browser settings, though signing in may stop working. You can manage personalised advertising at <a href="https://adssettings.google.com" style={{ textDecoration: 'underline' }}>adssettings.google.com</a>.</p>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>6. Data Retention</h2>
        <p>Account data and saved decks are kept until you delete your account. You can delete your account and all its data from your account settings, or by contacting us.</p>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>7. Your Rights</h2>
        <p>Under UK GDPR you have the right to access, correct, delete, restrict or object to our use of your personal data, and to withdraw consent at any time. To exercise these rights, contact us at the address below. You can also complain to the Information Commissioner&rsquo;s Office (ico.org.uk).</p>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>8. Contact</h2>
        <p>For any privacy-related questions, please email: <strong>support@flashcardmaker.co.uk</strong></p>
      </section>
    </main>
    </>
  );
}
