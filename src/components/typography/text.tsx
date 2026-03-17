// text.tsx
import { forwardRef } from 'react';
import type { HTMLChakraProps } from '@chakra-ui/react';
import { Typography } from './typography';
import { textStylesInRem } from '../../theme/tokens/typography';

export interface TextProps extends Omit<HTMLChakraProps<'span'>, 'variant'> {
  variant: 'heading' | 'body' | 'label' | 'caption';
  size:
    | 12
    | 14
    | 16
    | 18
    | 20
    | 24
    | 32
    | 40
    | 48
    | 56
    | 64
    | 72
    | 80
    | 96
    | 104
    | 112
    | 120;
  weight: 'Regular' | 'Medium' | 'Bold';
  as?: React.ElementType;
  children: React.ReactNode;
}

// Helper to determine semantic HTML tag based on variant and size
const getSemanticElement = (
  variant: TextProps['variant'],
  size: TextProps['size']
): React.ElementType => {
  if (variant === 'heading') {
    if (size >= 80) return 'h1';
    if (size >= 64) return 'h2';
    if (size >= 48) return 'h3';
    if (size >= 32) return 'h4';
    if (size >= 24) return 'h5';
    return 'h6';
  }
  if (variant === 'label') return 'label';
  if (variant === 'caption') return 'span'; // could also be 'figcaption' based on usage

  return 'p'; // Default for body
};

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ variant, size, weight, as, children, ...props }, ref) => {
    const textStyleKey =
      `${variant}/${weight.toLowerCase()}/${size}` as keyof typeof textStylesInRem;
    const resolvedStyles = textStylesInRem[textStyleKey];

    const Component = as || getSemanticElement(variant, size);

    if (!resolvedStyles) {
      console.warn(
        `Typography: Invalid combination - variant: ${variant}, size: ${size}, weight: ${weight}`
      );
      return (
        <Typography ref={ref} as={Component} {...props}>
          {children}
        </Typography>
      );
    }

    return (
      <Typography
        ref={ref}
        as={Component}
        {...resolvedStyles}
        letterSpacing="0"
        {...props}
      >
        {children}
      </Typography>
    );
  }
);

Text.displayName = 'Text';
