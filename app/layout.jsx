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
          src="https://www.paypal.com/sdk/js?client-id=AQHtoUyjhNa9CsOLS4kVcsEe4no4kiQ0xBM8molUYQUW4bxC2I0Fa5aiq_9xMvDjbFCruQsF5N-GSGor&currency=USD&enable-funding=card"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
