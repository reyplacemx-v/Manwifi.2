import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'NexusWave Pro - Advanced WiFi Network & Credential Management',
  description: 'Pro-grade WiFi management, speed testing, AP remote control, WPA3 security hardening, and encrypted credential vault.',
  manifest: '/manifest.json',
  themeColor: '#06b6d4',
  openGraph: {
    title: 'NexusWave Pro WiFi Manager',
    description: 'Advanced WiFi network management, signal optimization, and security vault.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusWave Pro WiFi Manager',
    description: 'Advanced WiFi network management and security vault.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06b6d4" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
