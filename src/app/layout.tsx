import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Box, Container, Flex } from '@radix-ui/themes';
import { Text } from '@/components/Text';

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
        <ThemeProvider>
          <Container style={{ background: 'var(--gray-a2)' }}>
            <Flex direction="column" justify="center" align="center">
              <Text variant="h1">Black & Jack</Text>
              <Box flexGrow="1">{children}</Box>
              <Text variant="h2">Footer</Text>
            </Flex>
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
