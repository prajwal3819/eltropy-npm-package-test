import { forwardRef, cloneElement, isValidElement } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import CheckmarkCircleIcon from '../../../assets/icons/checkmark-circle';
import { type DropdownOption } from '../types';

interface DropdownItemProps {
  item: DropdownOption;
  isSelected: boolean;
  isFocused: boolean;
  onSelect: (value: string) => void;
  onMouseEnter: () => void;
  styles: Record<string, any>;
  idPrefix?: string;
}

export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  (
    {
      item,
      isSelected,
      isFocused,
      onSelect,
      onMouseEnter,
      styles,
      idPrefix = 'dropdown',
    },
    ref,
  ) => {
    const renderItemIcon = () => {
      if (!item.icon || !isValidElement(item.icon)) return null;
      return (
        <Box css={styles.itemIcon}>
          {cloneElement(
            item.icon as React.ReactElement<{
              width?: string;
              height?: string;
            }>,
            {
              width: '100%',
              height: '100%',
            },
          )}
        </Box>
      );
    };

    return (
      <Flex
        ref={ref}
        id={`${idPrefix}-option-${item.value}`}
        css={styles.item}
        bg={isSelected ? 'green.50' : isFocused ? 'gray.50' : 'transparent'}
        onClick={() => onSelect(item.value)}
        onMouseEnter={onMouseEnter}
        role="option"
        aria-selected={isSelected}
        tabIndex={-1}
        _hover={{ bg: isSelected ? 'green.50' : 'gray.50' }}
      >
        {renderItemIcon()}
        <Text
          as="span"
          css={styles.itemText}
          fontFamily={isSelected ? 'heading' : undefined}
          fontWeight={isSelected ? 'medium' : undefined}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Box css={styles.itemCheckIcon}>
            <CheckmarkCircleIcon
              width="1em"
              height="1em"
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        )}
      </Flex>
    );
  },
);

DropdownItem.displayName = 'DropdownItem';
