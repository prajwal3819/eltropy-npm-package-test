import { forwardRef } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

interface DropdownLabelProps {
  label?: string;
  labelSubtext?: string;
  required?: boolean;
  optional?: boolean;
  styles: Record<string, any>;
}

export const DropdownLabel = forwardRef<HTMLDivElement, DropdownLabelProps>(
  ({ label, labelSubtext, required, optional, styles }, ref) => {
    if (!label && !labelSubtext) return null;

    return (
      <Box ref={ref} css={styles.labelContainer}>
        {label && (
          <Flex css={styles.labelRow}>
            <Text as="span" css={styles.label}>
              {label}
            </Text>
            {required && (
              <Text as="span" css={styles.required}>
                *
              </Text>
            )}
            {optional && (
              <Text as="span" css={styles.optional}>
                (optional)
              </Text>
            )}
          </Flex>
        )}
        {labelSubtext && (
          <Text as="span" css={styles.labelSubtext}>
            {labelSubtext}
          </Text>
        )}
      </Box>
    );
  },
);

DropdownLabel.displayName = 'DropdownLabel';
