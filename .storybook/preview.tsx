import React from 'react';
import '@/app/globals.css';
import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@/components/ThemeProvider';

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  decorators: [(Story) => <ThemeProvider minHeight="auto">{Story()}</ThemeProvider>],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
