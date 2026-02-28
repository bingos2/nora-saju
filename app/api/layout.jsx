import './globals.css'

export const metadata = {
  title: 'Nora Reads You',
  description: 'Korean fortune-telling that actually gets you. Find out your element.',
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
      </head>
      <body>{children}</body>
    </html>
  )
}
