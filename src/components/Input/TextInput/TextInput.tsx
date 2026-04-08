import { Box, Flex, Text, useSlotRecipe } from '@chakra-ui/react';
import { forwardRef, cloneElement, isValidElement } from 'react';
import { textInputRecipe } from '../../../theme/recipes/text-input.recipe';
import type { HTMLChakraProps } from '@chakra-ui/react';
import { ErrorCircleIcon } from '../../../assets/icons';

export interface TextInputProps extends Omit<HTMLChakraProps<'input'>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  subtext?: string;
  supportingText?: string;
  error?: string;
  isRequired?: boolean;
  optionalText?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  isInvalid?: boolean;
  onRightIconClick?: () => void;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      size = 'md',
      label,
      subtext,
      supportingText,
      error,
      isRequired,
      optionalText,
      leftIcon,
      rightIcon,
      onRightIconClick,
      disabled,
      isInvalid,
      ...props
    },
    ref
  ) => {
    const hasError = !!error || isInvalid;

    const recipe = useSlotRecipe({ recipe: textInputRecipe });
    const styles = recipe({
      size,
      hasLeftIcon: !!leftIcon,
      hasRightIcon: !!rightIcon
    });

    const iconSize = {
      sm: '16px',
      md: '20px',
      lg: '24px'
    }[size];

    const renderIcon = (
      icon: React.ReactElement | undefined,
      position: 'left' | 'right'
    ) => {
      if (!icon) return null;

      const styledIcon = isValidElement(icon)
        ? cloneElement(icon, {
            ...((icon.props as any) || {}),
            style: {
              width: iconSize,
              height: iconSize,
              color: disabled ? 'gray.400' : 'gray.500',
              ...((icon.props as any)?.style || {})
            }
          } as any)
        : icon;

      const isClickable = position === 'right' && !!onRightIconClick;

      return (
        <Box
          as={isClickable ? 'button' : 'div'}
          {...(isClickable
            ? { type: 'button', onClick: onRightIconClick }
            : {})}
          css={styles.iconContainer}
          {...(position === 'left' ? { left: '12px' } : { right: '12px' })}
          cursor={isClickable && !disabled ? 'pointer' : 'default'}
          {...(isClickable ? { disabled } : {})}
          _focusVisible={
            isClickable
              ? {
                  outline: '2px solid',
                  outlineColor: 'blue.600',
                  outlineOffset: '2px'
                }
              : undefined
          }
        >
          {styledIcon}
        </Box>
      );
    };

    return (
      <Flex css={styles.root}>
        {(label || subtext) && (
          <Flex direction="column" gap="0.5">
            {label && (
              <Flex align="center" gap="1">
                <Text css={styles.label}>{label}</Text>
                {isRequired && (
                  <Text fontSize="sm" color="gray.400" aria-hidden="true">
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
          {renderIcon(leftIcon, 'left')}

          <Box
            as="input"
            ref={ref}
            css={styles.input}
            disabled={disabled}
            aria-disabled={disabled}
            aria-invalid={hasError}
            data-invalid={hasError ? '' : undefined}
            {...(props as any)}
          />

          {renderIcon(rightIcon, 'right')}
        </Box>

        {(supportingText || error) && (
          <Flex align="center" gap="1.5" mt="0.5">
            {hasError && (
              <Box color="red.200" display="flex" aria-hidden="true">
                <ErrorCircleIcon />
              </Box>
            )}
            <Text
              css={styles.supportingText}
              color={hasError ? 'red.200' : undefined}
              fontWeight={hasError ? 'medium' : 'normal'}
            >
              {error || supportingText}
            </Text>
          </Flex>
        )}
      </Flex>
    );
  }
);

TextInput.displayName = 'TextInput';
