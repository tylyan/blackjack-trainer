import { Flex, TextField } from '@radix-ui/themes';
import { RootProps } from '@radix-ui/themes/src/components/text-field.jsx';
import { Text } from './Text';

type InputProps = RootProps;

export const Input = (props: InputProps) => {
  return <TextField.Root {...props} />;
};

interface InputWithLabelProps {
  label: string;
}

export const InputWithLabel = ({ label, ...props }: InputWithLabelProps & InputProps) => {
  return (
    <Flex direction="column" gap="2">
      {/* TODO: figure out how to use color system and define my own preset */}
      <Text variant="label" color="gray">
        {label}
      </Text>
      <TextField.Root {...props} />
    </Flex>
  );
};
