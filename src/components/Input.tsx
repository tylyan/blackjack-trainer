import { TextField } from '@radix-ui/themes';
import { RootProps } from '@radix-ui/themes/src/components/text-field.jsx';

export const Input = (props: RootProps) => {
  return <TextField.Root {...props} />;
};
