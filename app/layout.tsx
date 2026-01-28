import type { Metadata } from 'next'
import { Oswald, Manrope } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-manrope',
  display: 'swap',
})

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://parcefx.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: 'ParceFX - El Trader de Miami | Estrategias de Trading Reales',
  description: 'Aprende las estrategias exactas de trading que uso para generar resultados consistentes. Opera en vivo con un trader profesional desde Miami, Florida.',
  keywords: ['trading', 'forex', 'estrategias trading', 'trader miami', 'parcefx', 'trading en vivo'],
  authors: [{ name: 'ParceFX' }],
  openGraph: {
    title: 'ParceFX - El Trader de Miami',
    description: 'Aprende las estrategias exactas de trading que uso para generar resultados consistentes. Opera en vivo con un trader profesional.',
    url: appUrl,
    siteName: 'ParceFX',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ParceFX - Trading Strategies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ParceFX - El Trader de Miami',
    description: 'Aprende las estrategias exactas de trading que uso para generar resultados consistentes.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: appUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${oswald.variable} ${manrope.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  )
}
