import type { Metadata, Viewport } from 'next';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin'],
  weight: ['400'],
});

export const metadata: Metadata = {
  title: 'Tranquil — PMR & Breathing Relaxation',
  description:
    'Find calm through guided Progressive Muscle Relaxation, breathing exercises, and meditation. Reduce stress and tension with personalized relaxation programs.',
  keywords: [
    'progressive muscle relaxation',
    'PMR',
    'breathing exercises',
    'meditation',
    'stress relief',
    'relaxation',
    'anxiety relief',
    'mindfulness',
  ],
  authors: [{ name: 'Tranquil' }],
  openGraph: {
    title: 'Tranquil — PMR & Breathing Relaxation',
    description:
      'Find calm through guided Progressive Muscle Relaxation, breathing exercises, and meditation.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tranquil — PMR & Breathing Relaxation',
    description:
      'Find calm through guided Progressive Muscle Relaxation, breathing exercises, and meditation.',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tranquil',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8faf9' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1f1d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import { ServiceWorkerRegister } from '@/components/pwa/service-worker-register';
import { InstallPrompt } from '@/components/pwa/install-prompt';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body className="antialiased">
        {children}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  );
}
