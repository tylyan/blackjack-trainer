import React from 'react';
import '@/app/globals.css';
import type { Preview } from '@storybook/react';
import { Theme } from '@radix-ui/themes';

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  decorators: [
    (Story) => (
      <Theme style={{ minHeight: 'auto' }} accentColor="amber" grayColor="sand" radius="full">
        {Story()}
      </Theme>
    ),
  ],
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
