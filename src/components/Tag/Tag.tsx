import React, { forwardRef } from 'react';
import { Tag as ChakraTag } from '@chakra-ui/react';
import { CloseIcon } from '../../assets/icons';

export interface TagProps extends ChakraTag.RootProps {
  /**
   * The content of the tag
   */
  children: React.ReactNode;
  /**
   * The variant style of the tag
   * @default 'solid'
   */
  variant?: 'solid' | 'subtle';
  /**
   * The size of the tag
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * The color scheme of the tag
   * @default 'gray'
   */
  colorScheme?:
    | 'red'
    | 'blue'
    | 'yellow'
    | 'green'
    | 'orange'
    | 'violet'
    | 'gray'
    | 'outlined';
  /**
   * Icon to display on the left side of the tag
   */
  leftIcon?: React.ReactElement;
  /**
   * Icon to display on the right side of the tag
   */
  rightIcon?: React.ReactElement;
  /**
   * Whether to show a close button on the right
   */
  closable?: boolean;
  /**
   * Callback when the close button is clicked
   */
  onClose?: () => void;
  /**
   * Callback when the tag is clicked
   */
  onClick?: () => void;
  /**
   * Whether the tag is disabled
   */
  disabled?: boolean;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      children,
      variant = 'solid',
      size = 'md',
      colorScheme = 'gray',
      leftIcon,
      rightIcon,
      closable = false,
      onClose,
      onClick,
      disabled = false,
      ...rest
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled && onClick) {
        onClick();
      }
    };

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!disabled && onClose) {
        onClose();
      }
    };

    return (
      <ChakraTag.Root
        ref={ref}
        variant={variant}
        size={size}
        colorScheme={colorScheme}
        onClick={handleClick}
        cursor={onClick && !disabled ? 'pointer' : 'default'}
        aria-disabled={disabled}
        pointerEvents={disabled ? 'none' : 'auto'}
        {...rest}
      >
        {leftIcon && (
          <ChakraTag.StartElement>{leftIcon}</ChakraTag.StartElement>
        )}

        <ChakraTag.Label>{children}</ChakraTag.Label>

        {rightIcon && !closable && (
          <ChakraTag.EndElement>{rightIcon}</ChakraTag.EndElement>
        )}

        {closable && (
          <ChakraTag.CloseTrigger onClick={handleClose} disabled={disabled}>
            <CloseIcon />
          </ChakraTag.CloseTrigger>
        )}
      </ChakraTag.Root>
    );
  },
);

Tag.displayName = 'Tag';
