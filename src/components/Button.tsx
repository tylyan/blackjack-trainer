import { Button as RadixButton, ButtonProps as RadixButtonProps } from '@radix-ui/themes';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'cta';

function getButtonStyles(variant: ButtonVariant): Partial<RadixButtonProps> {
  switch (variant) {
    case 'secondary':
      return { size: '2' as RadixButtonProps['size'], variant: 'outline' as RadixButtonProps['variant'] };
    case 'tertiary':
      return { size: '1' as RadixButtonProps['size'], variant: 'ghost' as RadixButtonProps['variant'] };
    case 'primary':
      return { size: '2' as RadixButtonProps['size'] };
    case 'cta':
    default:
      return { size: '3' as RadixButtonProps['size'], variant: 'classic' as RadixButtonProps['variant'] };
  }
}

interface ButtonProps {
  variant?: ButtonVariant;
}

export const Button = ({ variant = 'primary', ...props }: ButtonProps & Omit<RadixButtonProps, 'variant'>) => {
  const styles = getButtonStyles(variant);
  return <RadixButton {...styles} {...props} />;
};
