import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const emojiMap = {
  'Yin Wood': '🌿', 'Yang Wood': '🌲',
  'Yin Fire': '🕯️', 'Yang Fire': '🔥',
  'Yin Earth': '🪨', 'Yang Earth': '🌍',
  'Yin Metal': '🪬', 'Yang Metal': '⚔️',
  'Yin Water': '💧', 'Yang Water': '🌊',
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const element = searchParams.get('element') || 'Yin Wood';
  const c1 = searchParams.get('c1') || 'Yin Water';
  const c2 = searchParams.get('c2') || 'Yang Water';
  const c3 = searchParams.get('c3') || 'Yang Fire';

  const emoji = emojiMap[element] || '✨';
  const compatText = [c1, c2, c3]
    .map(c => `${emojiMap[c] || '✨'} ${c}`)
    .join('   ·   ');

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
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Purple orb */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-60px',
          width: '520px', height: '520px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,169,233,0.22) 0%, transparent 70%)',
          display: 'flex',
        }} />
        {/* Pink orb */}
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-40px',
          width: '420px', height: '420px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,180,211,0.18) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Corner TL */}
        <div style={{ position: 'absolute', top: 32, left: 32, width: 18, height: 18,
          borderTop: '1px solid rgba(201,169,233,0.45)', borderLeft: '1px solid rgba(201,169,233,0.45)', display: 'flex' }} />
        {/* Corner TR */}
        <div style={{ position: 'absolute', top: 32, right: 32, width: 18, height: 18,
          borderTop: '1px solid rgba(201,169,233,0.45)', borderRight: '1px solid rgba(201,169,233,0.45)', display: 'flex' }} />
        {/* Corner BL */}
        <div style={{ position: 'absolute', bottom: 32, left: 32, width: 18, height: 18,
          borderBottom: '1px solid rgba(201,169,233,0.45)', borderLeft: '1px solid rgba(201,169,233,0.45)', display: 'flex' }} />
        {/* Corner BR */}
        <div style={{ position: 'absolute', bottom: 32, right: 32, width: 18, height: 18,
          borderBottom: '1px solid rgba(201,169,233,0.45)', borderRight: '1px solid rgba(201,169,233,0.45)', display: 'flex' }} />

        {/* Eyebrow */}
        <div style={{ fontSize: 12, letterSpacing: '0.22em', color: 'rgba(201,169,233,0.65)', marginBottom: 28, display: 'flex' }}>
          KOREAN FOUR PILLARS · SAJU 사주
        </div>

        {/* Element */}
        <div style={{ fontSize: 88, fontStyle: 'italic', color: '#E8D5F8', marginBottom: 24, lineHeight: 1, display: 'flex' }}>
          {emoji}  {element}
        </div>

        {/* Divider */}
        <div style={{ width: 200, height: 1, background: 'rgba(201,169,233,0.2)', marginBottom: 20, display: 'flex' }} />

        {/* Best with */}
        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(245,243,250,0.28)', marginBottom: 14, display: 'flex' }}>
          BEST WITH
        </div>

        {/* Compatible */}
        <div style={{ fontSize: 22, color: 'rgba(245,243,250,0.72)', marginBottom: 44, display: 'flex' }}>
          {compatText}
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 16, fontStyle: 'italic', color: 'rgba(245,243,250,0.32)', marginBottom: 28, display: 'flex' }}>
          your chart just called you out.
        </div>

        {/* URL */}
        <div style={{ fontSize: 12, letterSpacing: '0.18em', color: 'rgba(201,169,233,0.46)', display: 'flex' }}>
          READNORA.COM
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
