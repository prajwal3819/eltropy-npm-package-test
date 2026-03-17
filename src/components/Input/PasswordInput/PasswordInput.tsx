import { Box, Flex, Text, useSlotRecipe } from '@chakra-ui/react';
import { forwardRef, useState, useEffect, useRef } from 'react';
import { textInputRecipe } from '../../../theme/recipes/text-input.recipe';
import type { HTMLChakraProps } from '@chakra-ui/react';
import {
  EyeCloseIcon,
  EyeOpenIcon,
  CheckFilledIcon,
  ErrorCircleIcon
} from '../../../assets/icons';

// Constants
const ICON_POSITION_RIGHT = '12px';
const ERROR_ICON_WIDTH = '16px';
const ERROR_TEXT_INDENT = '20px';
const DEFAULT_WIDTH = '280px';

// --- Internal Hook for Password Validation ---
type RequirementStatus = 'default' | 'met' | 'unmet';

interface PasswordRequirement {
  label: string;
  status: RequirementStatus;
}

const DEFAULT_REQUIREMENTS: PasswordRequirement[] = [
  { label: 'Minimum 8 characters', status: 'default' },
  { label: '1 uppercase', status: 'default' },
  { label: 'Atleast 1 special character', status: 'default' }
];

const usePasswordValidation = (password: string) => {
  const [requirements, setRequirements] =
    useState<PasswordRequirement[]>(DEFAULT_REQUIREMENTS);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!password) {
      setRequirements(DEFAULT_REQUIREMENTS);
      setIsValid(false);
      return;
    }

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    // Checks for standard special characters
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\-_+=\[\]\\/'~`]/.test(
      password
    );

    setRequirements([
      { label: 'Minimum 8 characters', status: hasMinLength ? 'met' : 'unmet' },
      { label: '1 uppercase', status: hasUppercase ? 'met' : 'unmet' },
      {
        label: 'Atleast 1 special character',
        status: hasSpecialChar ? 'met' : 'unmet'
      }
    ]);

    setIsValid(hasMinLength && hasUppercase && hasSpecialChar);
  }, [password]);

  return { requirements, isValid };
};
// ---------------------------------------------

export interface PasswordInputProps extends Omit<
  HTMLChakraProps<'input'>,
  'size' | 'type'
> {
  /** Size variant of the input */
  size?: 'sm' | 'md' | 'lg';
  /** Label text displayed above the input */
  label?: string;
  /** Subtext displayed below the label */
  subtext?: string;
  /** Error message to display */
  error?: string;
  /** Supporting text displayed below the input */
  supportingText?: string;
  /** Shows required indicator (*) */
  isRequired?: boolean;
  /** Optional text displayed next to label */
  optionalText?: string;
  /** Marks the input as invalid */
  isInvalid?: boolean;
  /** Callback fired whenever the password validity state changes */
  onValidityChange?: (isValid: boolean) => void;
  /** Width of the input container */
  width?: string | number;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      size = 'md',
      label,
      subtext,
      error,
      supportingText,
      isRequired,
      optionalText,
      disabled,
      isInvalid,
      onValidityChange,
      onChange,
      value,
      defaultValue,
      width = DEFAULT_WIDTH,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const onValidityChangeRef = useRef(onValidityChange);

    // Track the input value internally to feed the validation hook
    const [localValue, setLocalValue] = useState(
      value?.toString() || defaultValue?.toString() || ''
    );
    const currentValue = value !== undefined ? value.toString() : localValue;

    const { requirements, isValid } = usePasswordValidation(currentValue);
    const hasError = !!error || isInvalid;

    const recipe = useSlotRecipe({ recipe: textInputRecipe });
    const styles = recipe({ size, hasRightIcon: true });

    useEffect(() => {
      onValidityChangeRef.current = onValidityChange;
    });

    useEffect(() => {
      onValidityChangeRef.current?.(isValid);
    }, [isValid]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalValue(e.target.value);
      if (onChange) {
        onChange(e);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    const iconSize = { sm: '16px', md: '20px', lg: '24px' }[size];

    const eyeIconColor = hasError
      ? 'red.200'
      : isFocused
        ? 'navyGray.700'
        : disabled
          ? 'gray.400'
          : 'gray.500';

    return (
      <Flex css={styles.root} width={width}>
        {(label || subtext) && (
          <Flex direction="column" gap="12px">
            {label && (
              <Flex align="center" gap="1">
                <Text css={styles.label}>{label}</Text>
                {isRequired && (
                  <Text fontSize="sm" color="red.200" aria-hidden="true">
                    *
                  </Text>
                )}
                {optionalText && !isRequired && (
                  <Text fontSize="sm" color="gray.400">
                    {optionalText}
                  </Text>
                )}
              </Flex>
            )}
            {subtext && <Text css={styles.subtext}>{subtext}</Text>}
          </Flex>
        )}

        <Box
          position="relative"
          width="100%"
          display="flex"
          alignItems="center"
        >
          <Box
            as="input"
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            css={styles.input}
            disabled={disabled}
            aria-disabled={disabled}
            aria-invalid={hasError}
            data-invalid={hasError ? '' : undefined}
            value={value}
            defaultValue={defaultValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...(props as any)}
          />

          <Box
            as="button"
            onClick={() => !disabled && setShowPassword(!showPassword)}
            onMouseDown={(e) => e.preventDefault()}
            css={styles.iconContainer}
            right={ICON_POSITION_RIGHT}
            cursor={disabled ? 'default' : 'pointer'}
            pointerEvents={disabled ? 'none' : 'auto'}
            width={iconSize}
            height={iconSize}
            color={eyeIconColor}
            _focusVisible={{
              outline: '2px solid',
              outlineColor: 'blue.600',
              outlineOffset: '2px'
            }}
          >
            {showPassword ? <EyeOpenIcon /> : <EyeCloseIcon />}
          </Box>
        </Box>

        {/* Bottom Validation Group: Internal Requirements List */}
        {!hasError && !disabled && (
          <Flex direction="column" gap="12px" mt="12px">
            {requirements.map((req) => {
              const isMet = req.status === 'met';
              const isUnmet = req.status === 'unmet';
              const isDefault = req.status === 'default';

              let textColor = 'gray.600';
              if (isMet) textColor = 'successGreen.300';
              if (isUnmet) textColor = 'red.200';

              return (
                <Flex
                  key={req.label}
                  align="center"
                  gap={isDefault ? '0' : '1'}
                >
                  {!isDefault && (
                    <Box
                      width={ERROR_ICON_WIDTH}
                      display="flex"
                      justifyContent="center"
                      color={textColor}
                    >
                      {isMet && <CheckFilledIcon />}
                      {isUnmet && <ErrorCircleIcon />}
                    </Box>
                  )}
                  <Text fontSize="14px" color={textColor}>
                    {req.label}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        )}

        {/* Bottom Error / Supportive Text Group */}
        {(hasError || (disabled && supportingText)) && (
          <Flex direction="column" gap="12px" mt="12px">
            {hasError && error && (
              <Flex align="center" gap="4px">
                <Box color="red.200" display="flex" aria-hidden="true">
                  <ErrorCircleIcon />
                </Box>
                <Text fontSize="13px" color="red.200" fontWeight="medium">
                  {error}
                </Text>
              </Flex>
            )}

            {supportingText && (
              <Text
                fontSize="13px"
                color="gray.600"
                pl={hasError ? ERROR_TEXT_INDENT : '0'}
              >
                {supportingText}
              </Text>
            )}
          </Flex>
        )}
      </Flex>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
