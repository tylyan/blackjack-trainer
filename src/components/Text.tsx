import { Text as RadixText, TextProps as RadixTextProps } from '@radix-ui/themes';

type TextProps = RadixTextProps;

export const Text = ({ size, weight, children }: TextProps) => {
  return (
    <RadixText size={size} weight={weight}>
      {children}
    </RadixText>
  );
};
