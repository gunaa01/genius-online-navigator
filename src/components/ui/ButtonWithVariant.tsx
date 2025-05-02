import { Button, type ButtonProps } from './button';

interface ButtonWithVariantProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

export const ButtonWithVariant = ({
  variant = 'default',
  ...props
}: ButtonWithVariantProps) => {
  return <Button variant={variant} {...props} />;
};

export default ButtonWithVariant;
