import { Meta, StoryObj } from '@storybook/react';
import { Text } from './Text';

const meta = {
  title: 'atoms/Text',
  component: Text,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      control: { type: 'select' },
      defaultValue: '3',
      table: {
        type: { summary: 'The size of the text' },
      },
    },
    weight: {
      options: ['light', 'regular', 'medium', 'bold'],
      /**
       * type ControlType = 'object' | 'boolean' | 'check' | 'inline-check' |
       * 'radio' | 'inline-radio' | 'select' | 'multi-select' | 'number' |
       * 'range' | 'file' | 'color' | 'date' | 'text';
       */
      control: { type: 'select' },
      defaultValue: 'regular',
      table: {
        type: { summary: 'The weight of the text' },
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'body',
  },
};
