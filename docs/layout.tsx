import '../src/app/globals.css';
import { Theme } from '@radix-ui/themes';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Theme style={{ minHeight: 'auto' }} accentColor="amber" grayColor="sand" radius="full">
      {children}
    </Theme>
  );
}
