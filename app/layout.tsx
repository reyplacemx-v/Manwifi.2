import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles

export const viewport: Viewport = {
  themeColor: '#06b6d4',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'NexusWave Pro - Advanced WiFi Network & Credential Management',
  description: 'Pro-grade WiFi management, speed testing, AP remote control, WPA3 security hardening, and encrypted credential vault.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'NexusWave',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/nexuswave192/192/192" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
