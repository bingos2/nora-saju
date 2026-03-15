export const metadata = {
  title: 'Four Pillars of Destiny — Free Reading in English | Nora',
  description: 'The Four Pillars of Destiny (사주팔자) is a 2,000-year-old Korean and Chinese system that maps your personality, relationships, and life path from your birth date. Get a free AI reading in English — no sign-up needed.',
  alternates: {
    canonical: 'https://readnora.com/four-pillars-of-destiny',
  },
  openGraph: {
    title: 'Four Pillars of Destiny — Free Reading in English | Nora',
    description: 'What are the Four Pillars of Destiny? Learn the Korean saju system and get a free personalized reading powered by AI.',
    url: 'https://readnora.com/four-pillars-of-destiny',
    images: [{ url: 'https://readnora.com/og-image.png', width: 1200, height: 630 }],
    type: 'article',
  },
}

export default function FourPillarsPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #13111f;
          --bg2: #1a1830;
          --purple: #9b7fe8;
          --purple-pale: rgba(155,127,232,0.12);
          --purple-border: rgba(155,127,232,0.2);
          --gold: #c9a84c;
          --text: #e8e4f5;
          --text-soft: #9b96b8;
          --text-dim: #5e5a7a;
        }
        .fpd-body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          line-height: 1.75;
          min-height: 100vh;
        }
        nav.fpd-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(19,17,31,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--purple-border);
          padding: 0 24px;
          display: flex; align-items: center; justify-content: space-between;
          height: 58px;
        }
        .fpd-nav-logo {
          font-family: 'Syne', sans-serif;
          font-size: 1.15rem;
          color: var(--purple);
          text-decoration: none;
        }
        .fpd-nav-cta {
          background: var(--purple);
          color: #fff;
          text-decoration: none;
          padding: 8px 20px;
          border-radius: 100px;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .fpd-hero {
          max-width: 680px;
          margin: 0 auto;
          padding: 72px 24px 56px;
          text-align: center;
        }
        .fpd-eyebrow {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--purple);
          background: var(--purple-pale);
          border: 1px solid var(--purple-border);
          padding: 5px 14px;
          border-radius: 100px;
          margin-bottom: 24px;
        }
        .fpd-h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.9rem, 5vw, 3rem);
          line-height: 1.15;
          color: #fff;
          letter-spacing: -0.01em;
          margin-bottom: 18px;
        }
        .fpd-sub {
          font-size: 1.05rem;
          color: var(--text-soft);
          max-width: 520px;
          margin: 0 auto 36px;
          font-weight: 300;
        }
        .fpd-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--purple);
          color: #fff;
          text-decoration: none;
          padding: 14px 32px;
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 500;
        }
        .fpd-note { margin-top: 12px; font-size: 0.78rem; color: var(--text-dim); }
        .fpd-content { max-width: 680px; margin: 0 auto; padding: 0 24px 80px; }
        .fpd-divider { border: none; border-top: 1px solid var(--purple-border); margin: 48px 0; }
        .fpd-h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.35rem, 3vw, 1.75rem);
          color: #fff;
          letter-spacing: -0.01em;
          margin-bottom: 16px;
          line-height: 1.25;
        }
        .fpd-h3 {
          font-family: 'Instrument Serif', serif;
          font-style: italic;
          font-size: 1.15rem;
          color: var(--purple);
          margin-bottom: 8px;
          margin-top: 24px;
        }
        .fpd-p { margin-bottom: 16px; color: var(--text-soft); font-weight: 300; font-size: 0.97rem; }
        .fpd-p strong { color: var(--text); font-weight: 500; }
        .fpd-pillars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px; margin: 28px 0;
        }
        @media (max-width: 520px) { .fpd-pillars { grid-template-columns: repeat(2, 1fr); } }
        .fpd-pillar {
          background: var(--bg2);
          border: 1px solid var(--purple-border);
          border-radius: 12px;
          padding: 20px 12px;
          text-align: center;
        }
        .fpd-char {
          font-family: 'Instrument Serif', serif;
          font-size: 2.4rem;
          color: var(--gold);
          display: block;
          margin-bottom: 6px;
          line-height: 1;
        }
        .fpd-pillar-label { font-size: 0.68rem; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); }
        .fpd-pillar-el { font-size: 0.75rem; color: var(--purple); margin-top: 4px; }
        .fpd-elements {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px; margin: 24px 0;
        }
        @media (max-width: 480px) { .fpd-elements { grid-template-columns: repeat(3, 1fr); } }
        .fpd-el-card {
          background: var(--bg2);
          border: 1px solid var(--purple-border);
          border-radius: 10px;
          padding: 14px 8px;
          text-align: center;
        }
        .fpd-el-emoji { font-size: 1.5rem; display: block; margin-bottom: 6px; }
        .fpd-el-name { font-size: 0.78rem; font-weight: 500; color: var(--text); }
        .fpd-el-desc { font-size: 0.68rem; color: var(--text-dim); margin-top: 3px; line-height: 1.4; }
        .fpd-faq-item { border-bottom: 1px solid var(--purple-border); padding: 22px 0; }
        .fpd-faq-item:first-child { border-top: 1px solid var(--purple-border); }
        .fpd-faq-q {
          font-size: 0.97rem; font-weight: 500; color: var(--text);
          cursor: pointer; display: flex; justify-content: space-between;
          align-items: flex-start; gap: 16px; list-style: none;
          background: none; border: none; width: 100%; text-align: left;
          padding: 0; font-family: 'DM Sans', sans-serif;
        }
        .fpd-faq-icon {
          width: 22px; height: 22px; border-radius: 50%;
          background: var(--purple-pale); border: 1px solid var(--purple-border);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: var(--purple); font-size: 1.1rem;
          transition: transform 0.2s;
        }
        .fpd-faq-item.open .fpd-faq-icon { transform: rotate(45deg); }
        .fpd-faq-a {
          display: none; padding-top: 12px;
          font-size: 0.92rem; font-weight: 300;
          color: var(--text-soft); line-height: 1.7;
        }
        .fpd-faq-item.open .fpd-faq-a { display: block; }
        .fpd-cta-block {
          background: var(--bg2);
          border: 1px solid var(--purple-border);
          border-radius: 20px;
          padding: 48px 32px; text-align: center; margin-top: 56px;
        }
        .fpd-cta-block a {
          display: inline-block; background: var(--purple);
          color: #fff; text-decoration: none;
          padding: 14px 36px; border-radius: 100px;
          font-weight: 500; font-size: 1rem;
        }
        .fpd-cta-note { font-size: 0.75rem; color: var(--text-dim); margin-top: 12px; }
        footer.fpd-footer {
          border-top: 1px solid var(--purple-border);
          padding: 28px 24px; text-align: center;
          font-size: 0.78rem; color: var(--text-dim);
        }
        footer.fpd-footer a { color: var(--purple); text-decoration: none; }
      `}</style>

      <div className="fpd-body">
        <nav className="fpd-nav">
          <a className="fpd-nav-logo" href="/">Nora ✦</a>
          <a className="fpd-nav-cta" href="/">Get a free reading</a>
        </nav>

        <div className="fpd-hero">
          <span className="fpd-eyebrow">Korean Saju · 사주팔자</span>
          <h1 className="fpd-h1">
            Four Pillars of Destiny —<br />
            what your birth date actually says about you
          </h1>
          <p className="fpd-sub">
            A 2,000-year-old system that uses the exact moment you were born
            to map your personality, relationships, and the patterns you keep repeating.
          </p>
          <a className="fpd-cta" href="/">✦ Get your free reading</a>
          <p className="fpd-note">Takes 3 minutes · No sign-up needed</p>
        </div>

        <div className="fpd-content">

          <h2 className="fpd-h2">What is the Four Pillars of Destiny?</h2>
          <p className="fpd-p">
            The Four Pillars of Destiny — called <strong>사주팔자 (saju palja)</strong> in Korean
            and <em>bazi</em> in Chinese — is one of the oldest personality and destiny systems
            in East Asia. It has been used by Korean and Chinese scholars, doctors, and advisors
            for over 2,000 years to understand a person's nature, health, relationships, and fortune.
          </p>
          <p className="fpd-p">
            Unlike Western astrology, which assigns a single sun sign, saju uses{' '}
            <strong>four distinct pillars</strong> — one each for your birth year, month, day,
            and hour. Each pillar is made up of two characters: a Heavenly Stem and an Earthly Branch.
            Together they form a unique 8-character map called your <em>palja</em> (八字).
          </p>

          <div className="fpd-pillars">
            {[
              { char: '己', label: 'Year', el: 'Yin Earth' },
              { char: '丁', label: 'Month', el: 'Yin Fire' },
              { char: '辛', label: 'Day', el: 'Yin Metal' },
              { char: '癸', label: 'Hour', el: 'Yin Water' },
            ].map(p => (
              <div key={p.label} className="fpd-pillar">
                <span className="fpd-char">{p.char}</span>
                <div className="fpd-pillar-label">{p.label}</div>
                <div className="fpd-pillar-el">{p.el}</div>
              </div>
            ))}
          </div>

          <p className="fpd-p">
            The Day Pillar is the most important — your <strong>Day Master</strong>{' '}
            represents your core self. Everything else in your chart is interpreted in relation to it.
          </p>

          <hr className="fpd-divider" />

          <h2 className="fpd-h2">The Five Elements</h2>
          <p className="fpd-p">
            All eight characters in your chart belong to one of five elements.
            The balance — or imbalance — between them shapes your personality,
            health tendencies, and the kinds of relationships you're drawn to.
          </p>

          <div className="fpd-elements">
            {[
              { emoji: '🌿', name: 'Wood', desc: 'Growth, vision, ambition' },
              { emoji: '🔥', name: 'Fire', desc: 'Expression, charisma, warmth' },
              { emoji: '🪨', name: 'Earth', desc: 'Stability, loyalty, patience' },
              { emoji: '⚔️', name: 'Metal', desc: 'Precision, integrity, clarity' },
              { emoji: '🌊', name: 'Water', desc: 'Depth, intuition, adaptability' },
            ].map(e => (
              <div key={e.name} className="fpd-el-card">
                <span className="fpd-el-emoji">{e.emoji}</span>
                <div className="fpd-el-name">{e.name}</div>
                <div className="fpd-el-desc">{e.desc}</div>
              </div>
            ))}
          </div>

          <hr className="fpd-divider" />

          <h2 className="fpd-h2">Saju vs. Western astrology</h2>
          <p className="fpd-p">
            Western astrology places the most weight on where the planets were positioned at birth.
            Saju ignores planetary positions entirely — it's based purely on the calendar system
            and the cyclical pattern of Heavenly Stems and Earthly Branches running through time.
          </p>
          <p className="fpd-p">
            The result is that saju tends to be less focused on events and more focused on{' '}
            <strong>character</strong>: your default patterns, what kind of people you attract,
            why you keep ending up in the same situations, and what your natural strengths and blind spots are.
          </p>

          <hr className="fpd-divider" />

          <h2 className="fpd-h2">What does a saju reading actually tell you?</h2>

          <h3 className="fpd-h3">Your Day Master</h3>
          <p className="fpd-p">
            The element and polarity of who you fundamentally are. Yin Metal people, for example,
            are precise and quietly intense. Yang Wood people are driven and growth-oriented to a fault.
          </p>

          <h3 className="fpd-h3">Your missing element</h3>
          <p className="fpd-p">
            If one of the five elements doesn't appear in your chart, it points to an area of
            instinctive seeking. People with no Fire element often find themselves drawn to
            charismatic, expressive partners. People with no Water may struggle to let things be unclear.
          </p>

          <h3 className="fpd-h3">Your 10-year cycles (대운, daewoon)</h3>
          <p className="fpd-p">
            Saju divides your life into roughly 10-year periods, each governed by a different element.
            The quality of each decade depends on how that period's element interacts with your Day Master
            — which is why life can feel dramatically different in your 20s versus your 30s.
          </p>

          <h3 className="fpd-h3">Annual and monthly luck</h3>
          <p className="fpd-p">
            Each year and month carries its own elemental energy. A year that brings a strong
            supporting element might feel unusually productive. One that clashes with your Day Master
            may bring friction or transformation.
          </p>

          <hr className="fpd-divider" />

          <h2 className="fpd-h2">Frequently asked questions</h2>

          <FaqSection />

          <div className="fpd-cta-block">
            <h2 className="fpd-h2">Ready to read yours?</h2>
            <p className="fpd-p">
              Enter your birth date and Nora maps your chart in seconds —
              then tells you what it actually means in plain English.
            </p>
            <a href="/">✦ Start your free reading</a>
            <p className="fpd-cta-note">Free · 3 minutes · No sign-up</p>
          </div>

        </div>

        <footer className="fpd-footer">
          <p><a href="/">Nora</a> · AI Korean Fortune-Telling · <a href="/">readnora.com</a></p>
        </footer>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelectorAll('.fpd-faq-q').forEach(q => {
          q.addEventListener('click', () => q.closest('.fpd-faq-item').classList.toggle('open'));
        });
      `}} />
    </>
  )
}

const faqs = [
  {
    q: 'What is the Four Pillars of Destiny?',
    a: 'The Four Pillars of Destiny (사주팔자, saju palja) is a Korean and Chinese astrological system that uses your birth year, month, day, and hour to reveal your personality, strengths, and life patterns. Each pillar is made up of a Heavenly Stem and Earthly Branch, representing one of five elements: Wood, Fire, Earth, Metal, and Water.',
  },
  {
    q: 'How is saju different from Western astrology?',
    a: 'Western astrology assigns a single sun sign based on your birth month. Saju uses four pillars — year, month, day, and hour — creating over 12 million unique charts. It focuses less on future prediction and more on understanding your core nature, how you relate to others, and what seasons of life you\'re currently in.',
  },
  {
    q: 'What is a Day Master in saju?',
    a: 'Your Day Master is the Heavenly Stem in your Day Pillar — it\'s considered the most important element in your chart and represents the core of who you are. There are 10 possible Day Masters, each a yin or yang expression of one of the five elements (e.g., Yin Metal, Yang Water).',
  },
  {
    q: 'What does a missing element mean in saju?',
    a: 'If one of the five elements doesn\'t appear anywhere in your four pillars, it\'s considered a missing element. This doesn\'t mean something is wrong — it typically points to areas where you may feel challenged or where you instinctively seek balance through the people and environments you\'re drawn to.',
  },
  {
    q: 'Can I get a free Four Pillars of Destiny reading in English?',
    a: 'Yes. Nora offers a free AI-powered saju reading in English at readnora.com. You enter your birth date and time, and Nora generates a personalized reading of your Day Master, element, patterns, and a free area reading in love, money, work, or energy. No sign-up required.',
  },
  {
    q: 'How accurate is an AI saju reading?',
    a: 'Nora calculates your Four Pillars using the same traditional method as Korean saju masters — based on the solar calendar and Chinese sexagenary cycle. The interpretation layer uses AI trained on saju theory to translate your chart into plain English.',
  },
]

function FaqSection() {
  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} className="fpd-faq-item">
          <button className="fpd-faq-q">
            {faq.q}
            <span className="fpd-faq-icon">+</span>
          </button>
          <div className="fpd-faq-a">{faq.a}</div>
        </div>
      ))}
    </div>
  )
}
