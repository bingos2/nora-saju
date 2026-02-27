import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const emojiMap = {
  'Yin Wood': '🌿', 'Yang Wood': '🌲',
  'Yin Fire': '🕯️', 'Yang Fire': '🔥',
  'Yin Earth': '🪨', 'Yang Earth': '🌍',
  'Yin Metal': '🪬', 'Yang Metal': '⚔️',
  'Yin Water': '💧', 'Yang Water': '🌊',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const element = searchParams.get('element') || 'Yin Wood';
  const c1 = searchParams.get('c1') || 'Yin Water';
  const c2 = searchParams.get('c2') || 'Yang Water';
  const c3 = searchParams.get('c3') || 'Yang Fire';

  const emoji = emojiMap[element] || '✨';
  const compatText = [c1, c2, c3]
    .map(c => `${emojiMap[c] || '✨'} ${c}`)
    .join('   ·   ');

  // Load Instrument Serif italic from Google Fonts
  const fontRes = await fetch(
    'https://fonts.gstatic.com/s/instrumentserif/v1/Qw3MZRtWl0E_CRlAn3NMdKgRiq9zhPOFBNUYMQ.woff'
  );
  const fontData = await fontRes.arrayBuffer();

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0D0A15',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        {/* Purple orb left */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-60px',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,233,0.22) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        {/* Pink orb right */}
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-40px',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,180,211,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }} />

        {/* Corner TL */}
        <div style={{ position: 'absolute', top: 32, left: 32, width: 18, height: 18,
          borderTop: '1px solid rgba(201,169,233,0.45)', borderLeft: '1px solid rgba(201,169,233,0.45)' }} />
        {/* Corner TR */}
        <div style={{ position: 'absolute', top: 32, right: 32, width: 18, height: 18,
          borderTop: '1px solid rgba(201,169,233,0.45)', borderRight: '1px solid rgba(201,169,233,0.45)' }} />
        {/* Corner BL */}
        <div style={{ position: 'absolute', bottom: 32, left: 32, width: 18, height: 18,
          borderBottom: '1px solid rgba(201,169,233,0.45)', borderLeft: '1px solid rgba(201,169,233,0.45)' }} />
        {/* Corner BR */}
        <div style={{ position: 'absolute', bottom: 32, right: 32, width: 18, height: 18,
          borderBottom: '1px solid rgba(201,169,233,0.45)', borderRight: '1px solid rgba(201,169,233,0.45)' }} />

        {/* Glyph left */}
        <div style={{ position: 'absolute', bottom: 48, left: 52, fontSize: 22, opacity: 0.3 }}>✦</div>
        {/* Glyph right */}
        <div style={{ position: 'absolute', bottom: 46, right: 52, fontSize: 22, opacity: 0.3 }}>🌙</div>

        {/* Eyebrow */}
        <div style={{
          fontSize: 12, fontWeight: 500, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'rgba(201,169,233,0.65)',
          marginBottom: 28,
        }}>
          Korean Four Pillars · Saju 사주
        </div>

        {/* Element */}
        <div style={{
          fontSize: 96, fontStyle: 'italic',
          fontFamily: '"Instrument Serif"',
          background: 'linear-gradient(135deg, #E8D5F8 0%, #C9A9E9 40%, #E8B4D3 100%)',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: 24,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          {emoji}  {element}
        </div>

        {/* Divider */}
        <div style={{
          width: 200, height: 1,
          background: 'rgba(201,169,233,0.2)',
          marginBottom: 20,
        }} />

        {/* Best with label */}
        <div style={{
          fontSize: 11, fontWeight: 400, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'rgba(245,243,250,0.28)',
          marginBottom: 14,
        }}>
          best with
        </div>

        {/* Compatible elements */}
        <div style={{
          fontSize: 22, fontWeight: 400,
          color: 'rgba(245,243,250,0.72)',
          marginBottom: 44,
          letterSpacing: '0.02em',
        }}>
          {compatText}
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 16, fontWeight: 300,
          color: 'rgba(245,243,250,0.36)',
          marginBottom: 28,
        }}>
          your chart just called you out.
        </div>

        {/* URL */}
        <div style={{
          fontSize: 12, fontWeight: 500, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'rgba(201,169,233,0.46)',
        }}>
          READNORA.COM
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Instrument Serif', data: fontData, style: 'italic' }],
    }
  );
}
