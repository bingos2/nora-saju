import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Nora Reads You',
  description: 'Korean fortune-telling that actually gets you. Find out your element.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Nora Reads You',
    description: 'Korean fortune-telling that actually gets you. Find out your element.',
    url: 'https://readnora.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nora Reads You',
    description: 'Korean fortune-telling that actually gets you. Find out your element.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Syne:wght@700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17991018308"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17991018308');
          `}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4PJ35W6QR0"
          strategy="afterInteractive"
          />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4PJ35W6QR0');
          `}
        </Script>
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
      </head>
      <body>
        <noscript>
          <img height="1" width="1" style={{display:'none'}}
            src="https://www.facebook.com/tr?id=1444105087414207&ev=PageView&noscript=1"
            />
        </noscript>
        {children}
        <Script
          src="https://www.paypal.com/sdk/js?client-id=Acv54hNELtTY9zMqWepJps9u-OswKrKAavR7sDuk5w0HW5yhMagTuw8IQUNssPOo1Hq0NuLM2LE8HkLH&currency=USD&locale=en_US"
        />
      </body>
    </html>
  )
}
