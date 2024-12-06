import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Black & Jack',
  description: 'A simple blackjack training app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Theme accentColor="amber" grayColor="sand" radius="full">
          {children}
        </Theme>
      </body>
    </html>
  );
}
