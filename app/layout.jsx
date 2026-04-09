import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'The Most Accurate Saju Reading in English — Personalized by Nora',
  description: 'Not a generic horoscope. Nora reads your Korean Four Pillars of Destiny and gives you an accurate, personalized saju reading',
  keywords: 'saju reading, four pillars of destiny, korean fortune telling, ai fortune teller, free fortune reading',
  icons: {
    icon: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://readnora.com',
  },
  openGraph: {
    title: 'The Most Accurate Saju Reading in English — Personalized by Nora',
    description: 'Not a generic horoscope. Nora reads your Korean Four Pillars of Destiny and gives you an accurate, personalized saju reading',
    url: 'https://readnora.com',
    siteName: 'Nora',
    images: [{ url: 'https://readnora.com/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Most Accurate Saju Reading in English — Personalized by Nora',
    description: 'Not a generic horoscope. Nora reads your Korean Four Pillars of Destiny and gives you an accurate, personalized saju reading',
    images: ['https://readnora.com/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Syne:wght@700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1444105087414207&ev=PageView&noscript=1"
          />
        </noscript>

        {children}

        {/* Google Ads + Google Analytics — 하나로 합침 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17991018308"
          strategy="afterInteractive"
        />
        <Script id="google-tags" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17991018308');
            gtag('config', 'G-4PJ35W6QR0');
          `}
        </Script>
        
        {/* Reddit Pixel */}
        <Script id="reddit-pixel" strategy="afterInteractive">{`
        !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js?pixel_id=a2_ilfjdrn45r2c",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','a2_ilfjdrn45r2c');rdt('track', 'PageVisit');
        `}</Script>

        {/* TikTok Pixel */}
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
        !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
        ttq.load('D7BT7FJC77UFLDKDQVP0');
        ttq.page();
        }(window, document, 'ttq');
        `}</Script>
              
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1444105087414207');
            fbq('track', 'PageView');
          `}
        </Script>

        <Script
          src="https://www.paypal.com/sdk/js?client-id=AQHtoUyjhNa9CsOLS4kVcsEe4no4kiQ0xBM8molUYQUW4bxC2I0Fa5aiq_9xMvDjbFCruQsF5N-GSGor&currency=USD&intent=capture"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
