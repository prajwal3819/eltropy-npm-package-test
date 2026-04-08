import { chakra, Spinner, Group } from '@chakra-ui/react';
import { forwardRef, cloneElement, isValidElement } from 'react';
import { buttonRecipe } from '../../theme/recipes/button.recipe';
import type { HTMLChakraProps } from '@chakra-ui/react';

// Create base button using chakra factory with recipe
const BaseButton = chakra('button', buttonRecipe);

export interface ButtonProps extends HTMLChakraProps<'button'> {
  variant?:
    | 'primary'
    | 'outlined'
    | 'outlinedFilled'
    | 'ghost'
    | 'textLink'
    | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  loading?: boolean;
  loadingText?: string;
  iconOnly?: boolean;
  splitButton?: React.ReactElement;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      leftIcon,
      rightIcon,
      loading = false,
      loadingText,
      iconOnly = false,
      splitButton,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const iconSize = {
      xs: '12px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '24px',
    }[size];

    const renderIcon = (icon: React.ReactElement | undefined) => {
      if (!icon) return null;
      if (isValidElement(icon)) {
        const iconProps = icon.props as any;
        return cloneElement(icon, {
          ...iconProps,
          style: {
            width: iconSize,
            height: iconSize,
            ...(iconProps.style || {}),
          },
        });
      }
      return icon;
    };

    // If iconOnly, render IconButton with recipe styling
    if (iconOnly) {
      const icon = leftIcon || rightIcon;
      return (
        <BaseButton
          ref={ref}
          disabled={disabled}
          aria-disabled={disabled || loading}
          data-loading={loading || undefined}
          aria-label={props['aria-label'] || 'Icon button'}
          variant={variant}
          size={size}
          iconOnly={iconOnly}
          as="button"
          {...props}
        >
          {loading ? (
            <Spinner size="sm" color="currentColor" />
          ) : (
            renderIcon(icon)
          )}
        </BaseButton>
      );
    }

    // If splitButton, render Group with Button and IconButton using recipe styling
    if (splitButton) {
      // Split button specific styles (border separation)
      const splitIconButtonStyles = {
        borderLeft: '1px solid',
        borderColor:
          variant === 'primary' || variant === 'danger'
            ? 'green.50'
            : 'currentColor',
      };

      return (
        <Group attached>
          <BaseButton
            ref={ref}
            disabled={disabled}
            aria-disabled={disabled || loading}
            data-loading={loading || undefined}
            variant={variant}
            size={size}
            as="button"
            {...props}
          >
            {loading ? (
              <>
                <Spinner size="sm" color="currentColor" />
                {loadingText && <span>{loadingText}</span>}
              </>
            ) : (
              <>
                {renderIcon(leftIcon)}
                {children}
                {renderIcon(rightIcon)}
              </>
            )}
          </BaseButton>
          <BaseButton
            disabled={disabled}
            aria-label="Split button action"
            variant={variant}
            size={size}
            splitButton={true}
            as="button"
            css={splitIconButtonStyles}
          >
            {renderIcon(splitButton)}
          </BaseButton>
        </Group>
      );
    }

    // Regular button with recipe styling
    return (
      <BaseButton
        ref={ref}
        disabled={disabled}
        aria-disabled={disabled || loading}
        data-loading={loading || undefined}
        variant={variant}
        size={size}
        as="button"
        {...props}
      >
        {loading ? (
          <>
            <Spinner size="sm" color="currentColor" />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {renderIcon(leftIcon)}
            {children}
            {renderIcon(rightIcon)}
          </>
        )}
      </BaseButton>
    );
  },
);

Button.displayName = 'Button';
