import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';

export const ThemeProvider = ({ minHeight, children }: { minHeight?: string; children: React.ReactNode }) => {
  return (
    <Theme accentColor="amber" grayColor="sand" radius="large" style={{ minHeight }}>
      {children}
    </Theme>
  );
};
