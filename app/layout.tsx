import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from './components/SmoothScrollProvider';
import LuxCursor from './components/LuxCursor';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aurelia-estates.com'),
  title: {
    default: 'Aurelia Estates — Luxury Real Estate in Marbella & Costa del Sol',
    template: '%s · Aurelia Estates',
  },
  description:
    'Aurelia Estates is a premium real estate agency specialising in villas, beachfront residences and investment properties in Marbella, Sotogrande and the Costa del Sol.',
  keywords: [
    'Marbella luxury real estate',
    'villas Marbella',
    'Costa del Sol property investment',
    'Sotogrande villas',
    'beachfront residences Spain',
    'premium real estate agency',
  ],
  authors: [{ name: 'Aurelia Estates' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://aurelia-estates.com',
    siteName: 'Aurelia Estates',
    title: 'Aurelia Estates — Luxury Real Estate in Marbella',
    description:
      'A curated portfolio of exceptional villas and investment properties across the Costa del Sol.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        width: 1600,
        height: 900,
        alt: 'Aurelia Estates — Luxury Villa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aurelia Estates — Luxury Real Estate',
    description: 'A curated portfolio of exceptional villas across the Costa del Sol.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SmoothScrollProvider>
          <LuxCursor />
          {children}
        </SmoothScrollProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: 'Aurelia Estates',
              image:
                'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
              description:
                'Premium real estate agency specialising in villas and investment properties on the Costa del Sol.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Avenida del Mar, 27',
                addressLocality: 'Marbella',
                postalCode: '29602',
                addressCountry: 'ES',
              },
              telephone: '+34 952 000 000',
              priceRange: '€€€€',
              areaServed: ['Marbella', 'Sotogrande', 'Costa del Sol'],
            }),
          }}
        />
      </body>
    </html>
  );
}
