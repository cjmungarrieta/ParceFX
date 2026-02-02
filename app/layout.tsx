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

const siteTitle = 'ParceFX - Trader Independiente | Miami, FL'
const siteDescription = 'El trading no es magia, es disciplina. Recibe mi estrategia de entrada gratis: PDF, video y plantilla. Trader independiente desde Miami, sin promesas falsas.'

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: siteTitle,
    template: '%s | ParceFX',
  },
  description: siteDescription,
  keywords: ['trading', 'forex', 'estrategia trading gratis', 'trader miami', 'parcefx', 'trading real', 'gestión de riesgo', 'disciplina trading'],
  authors: [{ name: 'ParceFX', url: appUrl }],
  creator: 'ParceFX',
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: appUrl,
    siteName: 'ParceFX',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: appUrl,
  },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ParceFX',
    description: siteDescription,
    url: appUrl,
    inLanguage: 'es',
    publisher: {
      '@type': 'Organization',
      name: 'ParceFX',
      url: appUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${appUrl}/apple-icon`,
      },
    },
    potentialAction: {
      '@type': 'SubscribeAction',
      target: { '@type': 'EntryPoint', url: appUrl },
    },
  }

  return (
    <html lang="es" className={`${oswald.variable} ${manrope.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
