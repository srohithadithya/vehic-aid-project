import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vehic-Aid Customer Portal',
  description: 'Customer web app for Vehic-Aid vehicle assistance platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
