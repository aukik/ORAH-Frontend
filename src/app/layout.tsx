/**
 * Root layout for the Responsibly
 *
 * Aesthetic: BRUTALIST CIVIC AUTHORITY
 *
 * Typography:
 * - Bebas Neue: Commanding condensed display font (via CSS @import)
 * - IBM Plex Sans: Clean technical body font (via CSS @import)
 * - IBM Plex Mono: Monospace for data/code (via CSS @import)
 *
 * Fonts are loaded via @import in globals.css for simplicity
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Responsibly | Canadian Privacy Compliance',
    template: '%s | Responsibly',
  },
  description:
    'Assess your AI-related risks and ensure compliance with Canadian privacy laws including PIPEDA, Bill C-27, and provincial regulations. Free 10-minute assessment for small businesses.',
  keywords: [
    'AI compliance',
    'PIPEDA',
    'Canadian privacy law',
    'small business',
    'risk assessment',
    'Bill C-27',
    'AIDA',
  ],
  authors: [{ name: 'Responsibly' }],
  creator: 'Responsibly',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'Responsibly',
    title: 'Responsibly | Canadian Privacy Compliance',
    description:
      'Free 10-minute AI risk assessment for Canadian small businesses. Check your compliance with PIPEDA and provincial privacy laws.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
