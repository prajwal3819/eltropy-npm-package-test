import { forwardRef } from 'react';
import { Box, Text, Flex, Input } from '@chakra-ui/react';
import {
  CalendarIcon,
  ErrorCircleIcon,
  CloseIcon,
} from '../../../../assets/icons';

export interface DateInputFieldProps {
  label?: string;
  labelSubtext?: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onBlur?: () => void;
  onIconClick?: () => void;
  onClearClick?: () => void;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  enableTyping?: boolean;
  showClearButton?: boolean;
  inputStyles?: Record<string, any>;
}

export const DateInputField = forwardRef<HTMLDivElement, DateInputFieldProps>(
  (
    {
      label,
      labelSubtext,
      placeholder = 'mm/dd/yyyy',
      value,
      onChange,
      onKeyDown,
      onClick,
      onIconClick,
      onClearClick,
      onBlur,
      required = false,
      optional = false,
      disabled = false,
      error,
      helperText,
      enableTyping = false,
      showClearButton = false,
      inputStyles = {},
    },
    ref,
  ) => {
    return (
      <Flex ref={ref} flexDirection="column" gap="8px" width="280px">
        {label && (
          <Flex flexDirection="column" gap="4px">
            <Flex alignItems="center" gap="4px">
              <Text fontSize="12px" fontWeight="medium" color="navyGray.700">
                {label}
              </Text>
              {required && (
                <Text fontSize="16px" fontWeight="medium" color="red.200">
                  *
                </Text>
              )}
              {optional && (
                <Text
                  fontSize="12px"
                  fontWeight="regular"
                  color="gray.400"
                  lineHeight="18px"
                >
                  (optional)
                </Text>
              )}
            </Flex>
            {labelSubtext && (
              <Text fontSize="12px" fontWeight="medium" color="gray.600">
                {labelSubtext}
              </Text>
            )}
          </Flex>
        )}

        {enableTyping ? (
          <Flex
            {...inputStyles}
            position="relative"
            padding="0"
            borderColor={error ? 'red.200' : inputStyles.borderColor}
          >
            <Input
              flex="1"
              value={value}
              onChange={onChange}
              onKeyDown={onKeyDown}
              onBlur={onBlur}
              placeholder={placeholder}
              disabled={disabled}
              aria-label={label || 'Date input'}
              aria-required={required}
              aria-invalid={!!error}
              border="none"
              outline="none"
              bg="transparent"
              fontSize="14px"
              fontWeight="regular"
              color="navyGray.700"
              height="auto"
              padding="12px"
              paddingRight={showClearButton && value ? '60px' : '40px'}
              _placeholder={{ color: 'gray.400' }}
              _disabled={{ color: 'gray.400', cursor: 'not-allowed' }}
              _focus={{ outline: 'none', boxShadow: 'none' }}
            />
            <Flex
              alignItems="center"
              gap="8px"
              position="absolute"
              right="12px"
              top="50%"
              transform="translateY(-50%)"
            >
              {showClearButton && value && !disabled && (
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="16px"
                  height="16px"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  color="gray.400"
                  _hover={{ color: 'navyGray.700' }}
                  onClick={onClearClick}
                  aria-label="Clear date"
                >
                  <CloseIcon width="16px" height="16px" />
                </Box>
              )}
              <Box
                as={CalendarIcon}
                width="16px"
                height="16px"
                color={disabled ? 'gray.400' : 'navyGray.700'}
                flexShrink={0}
                cursor={disabled ? 'not-allowed' : 'pointer'}
                onClick={onIconClick}
              />
            </Flex>
          </Flex>
        ) : (
          <Box
            {...inputStyles}
            onClick={onClick}
            aria-disabled={disabled}
            role="button"
            tabIndex={disabled ? -1 : 0}
          >
            <Text
              flex="1"
              color={(!value || disabled) ? 'gray.400' : 'navyGray.700'}
              opacity={value ? 1 : 0.9}
            >
              {value || placeholder}
            </Text>
            <Flex alignItems="center" gap="8px">
              {showClearButton && value && !disabled && (
                <Box
                  as="button"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  width="16px"
                  height="16px"
                  bg="transparent"
                  border="none"
                  cursor="pointer"
                  color="gray.400"
                  _hover={{ color: 'navyGray.700' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClearClick?.();
                  }}
                  aria-label="Clear date"
                >
                  <CloseIcon width="16px" height="16px" />
                </Box>
              )}
              <Box
                as={CalendarIcon}
                width="16px"
                height="16px"
                color={disabled ? 'gray.400' : 'navyGray.700'}
                flexShrink={0}
              />
            </Flex>
          </Box>
        )}

        {error && (
          <Flex alignItems="center" gap="4px">
            <Box
              as={ErrorCircleIcon}
              width="16px"
              height="16px"
              color="red.200"
            />
            <Text
              fontSize="12px"
              fontWeight="regular"
              color="red.200"
              lineHeight="18px"
            >
              {error}
            </Text>
          </Flex>
        )}

        {helperText && !error && (
          <Text
            fontSize="12px"
            fontWeight="regular"
            color="gray.500"
            lineHeight="18px"
          >
            {helperText}
          </Text>
        )}
      </Flex>
    );
  },
);

DateInputField.displayName = 'DateInputField';
