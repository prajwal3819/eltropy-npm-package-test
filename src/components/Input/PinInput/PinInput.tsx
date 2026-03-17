import {
  chakra,
  Flex,
  Box,
  Text,
  PinInput as ChakraPinInput
} from '@chakra-ui/react';
import { forwardRef } from 'react';
import { pinInputRecipe } from '../../../theme/recipes/pin-input.recipe';

const StyledPinInputField = chakra(ChakraPinInput.Input, pinInputRecipe);

export interface PinInputProps extends ChakraPinInput.RootProps {
  /** Number of PIN boxes to display (default: 6) */
  length?: number;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PinInput = forwardRef<HTMLDivElement, PinInputProps>(
  ({ length = 6, invalid, disabled, error, size = 'md', ...props }, ref) => {
    const hasError = !!error || invalid;
    const pinFields = Array.from({ length });

    return (
      <Flex direction="column" gap="2" width="fit-content">
        <ChakraPinInput.Root
          ref={ref}
          invalid={hasError}
          disabled={disabled}
          placeholder=""
          {...props}
        >
          <ChakraPinInput.HiddenInput />

          <ChakraPinInput.Control display="flex" gap="2">
            {pinFields.map((_, index) => (
              <StyledPinInputField key={index} index={index} size={size} />
            ))}
          </ChakraPinInput.Control>
        </ChakraPinInput.Root>

        {hasError && error && (
          <Flex align="center" gap="1.5" mt="0.5">
            <Box color="red.200" display="flex" aria-hidden="true">
              <svg
                width="12"
                height="12"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
              </svg>
            </Box>
            <Text fontSize="xs" color="red.200" fontWeight="medium">
              {error}
            </Text>
          </Flex>
        )}
      </Flex>
    );
  }
);

PinInput.displayName = 'PinInput';
