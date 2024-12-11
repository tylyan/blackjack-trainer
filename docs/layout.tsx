import { ThemeProvider } from '../src/components/ThemeProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider minHeight="auto">{children}</ThemeProvider>;
}
