import { Box, type HTMLChakraProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type TypographyProps = HTMLChakraProps<'div'>;

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  (props, ref) => {
    return <Box ref={ref} {...props} />;
  }
);

Typography.displayName = 'Typography';
