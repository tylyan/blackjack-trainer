import { Text as RadixText, TextProps as RadixTextProps } from '@radix-ui/themes';

// type TextProps = RadixTextProps;

export type TextVariant = 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'body';

function getTextStyles(variant: TextVariant) {
  switch (variant) {
    case 'title':
      return { size: '9' as const, weight: 'bold' as const };
    case 'subtitle':
      return { size: '8' as const, weight: 'light' as const, textTransform: 'uppercase' as const };
    case 'h1':
      return { size: '7' as const, weight: 'regular' as const };
    case 'h2':
      return { size: '6' as const, weight: 'regular' as const };
    case 'h3':
      return { size: '5' as const, weight: 'regular' as const };
    case 'body':
    default:
      return { size: '3' as const, weight: 'regular' as const };
  }
}

interface TextProps {
  variant?: TextVariant;
}

export const Text = ({ variant = 'body', children, ...props }: TextProps & RadixTextProps) => {
  const { size, weight, textTransform } = getTextStyles(variant);

  return (
    <RadixText style={{ textTransform }} size={size} weight={weight} {...props}>
      {children}
    </RadixText>
  );
};
