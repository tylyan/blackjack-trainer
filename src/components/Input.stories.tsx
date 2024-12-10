import { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { fn } from '@storybook/test';

const meta = {
  title: 'atoms/Input',
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Default Input',
  },
};

export const Password: Story = {
  args: {
    placeholder: 'Super secret password',
    type: 'password',
    value: 'super secret password',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled Input',
    disabled: true,
  },
};
