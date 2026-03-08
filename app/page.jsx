export default function PrivacyPolicy() {
  return (
    <div style={{
      background: '#09070f',
      minHeight: '100vh',
      color: '#e0d8f0',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      padding: '0 0 80px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '80px 32px 48px'
      }}>
        <a href="/" style={{
          fontSize: '14px',
          letterSpacing: '0.15em',
          color: 'rgba(201,169,233,0.6)',
          textDecoration: 'none',
          textTransform: 'uppercase'
        }}>← Back to Nora</a>

        <h1 style={{
          marginTop: '48px',
          fontSize: '42px',
          fontStyle: 'italic',
          fontWeight: '400',
          color: '#E8D5F8',
          lineHeight: '1.2'
        }}>Privacy Policy</h1>

        <p style={{
          marginTop: '16px',
          fontSize: '14px',
          color: 'rgba(201,169,233,0.5)',
          letterSpacing: '0.1em'
        }}>Last updated: March 8, 2026</p>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '0 32px'
      }}>

        <Section title="1. Who We Are">
          <p>Nora ("we", "us", "our") operates readnora.com, a Korean saju (Four Pillars of Destiny) reading service. If you have questions about this policy, contact us at hi@readnora.com.</p>
        </Section>

        <Section title="2. What Information We Collect">
          <p>We collect the following information when you use our service:</p>
          <ul>
            <li><strong>Name</strong> — first name or preferred name you provide</li>
            <li><strong>Date of birth</strong> — required to generate your saju reading</li>
            <li><strong>Birth time</strong> — optional, used to improve reading accuracy</li>
            <li><strong>Timezone</strong> — used to convert your birth time accurately</li>
            <li><strong>Email address</strong> — collected when you request a full reading or sign up for updates</li>
            <li><strong>Payment information</strong> — processed securely by PayPal; we do not store your payment details</li>
            <li><strong>Usage data</strong> — pages visited, actions taken, collected via Google Analytics and Meta Pixel</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use your information to:</p>
          <ul>
            <li>Generate your personalized saju reading</li>
            <li>Send your full reading to your email address</li>
            <li>Send weekly updates if you opted in</li>
            <li>Process your payment via PayPal</li>
            <li>Improve our service and understand how people use Nora</li>
            <li>Show you relevant ads on Google, Meta (Instagram/Facebook), and Reddit</li>
          </ul>
        </Section>

        <Section title="4. Third Parties We Share Data With">
          <p>We work with the following third-party services:</p>
          <ul>
            <li><strong>OpenAI</strong> — generates your saju reading based on your birth data</li>
            <li><strong>PayPal</strong> — processes payments securely</li>
            <li><strong>Mailgun</strong> — sends your reading to your email</li>
            <li><strong>Make (Integromat)</strong> — automates our reading workflow</li>
            <li><strong>Google Analytics & Google Ads</strong> — tracks website usage and ad performance</li>
            <li><strong>Meta Pixel (Facebook/Instagram)</strong> — tracks ad performance</li>
            <li><strong>Google Sheets</strong> — stores email addresses for users who opt in to updates</li>
          </ul>
          <p style={{marginTop: '16px'}}>We do not sell your personal information to any third party.</p>
        </Section>

        <Section title="5. Cookies & Tracking">
          <p>We use cookies and similar tracking technologies through Google Analytics and Meta Pixel to understand how visitors use our site and to measure ad performance. By using readnora.com, you consent to this tracking.</p>
          <p style={{marginTop: '12px'}}>You can opt out of Google Analytics tracking at <a href="https://tools.google.com/dlpage/gaoptout" style={{color: 'rgba(201,169,233,0.8)'}}>tools.google.com/dlpage/gaoptout</a>.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>We retain your email address and reading data for as long as needed to provide our service. If you opted in to weekly updates, we retain your email until you unsubscribe. You may request deletion of your data at any time.</p>
        </Section>

        <Section title="7. Your Rights (CCPA — California Residents)">
          <p>If you are a California resident, you have the right to:</p>
          <ul>
            <li>Know what personal information we collect about you</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of the sale of your personal information (we do not sell your data)</li>
            <li>Non-discrimination for exercising your privacy rights</li>
          </ul>
          <p style={{marginTop: '12px'}}>To exercise these rights, email us at hi@readnora.com.</p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>Nora is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately at hi@readnora.com.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this page. Continued use of readnora.com after changes constitutes acceptance of the updated policy.</p>
        </Section>

        <Section title="10. Contact Us">
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p style={{marginTop: '12px'}}>
            <strong>Email:</strong> hi@readnora.com<br/>
            <strong>Website:</strong> readnora.com
          </p>
        </Section>

      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{
      marginBottom: '48px',
      paddingBottom: '48px',
      borderBottom: '1px solid rgba(201,169,233,0.1)'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#C9A9E9',
        letterSpacing: '0.05em',
        marginBottom: '20px'
      }}>{title}</h2>
      <div style={{
        fontSize: '16px',
        lineHeight: '1.85',
        color: 'rgba(245,243,250,0.72)'
      }}>
        {children}
      </div>
      <style>{`
        ul { padding-left: 24px; margin: 12px 0; }
        li { margin-bottom: 8px; }
        strong { color: rgba(245,243,250,0.9); }
        p { margin: 0; }
      `}</style>
    </div>
  )
}
