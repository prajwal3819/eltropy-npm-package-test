import { forwardRef } from 'react';
import { Portal, Box, Text, Flex } from '@chakra-ui/react';
import CheckmarkCircleIcon from '../../../../assets/icons/checkmark-circle';
import { TextInput } from '../../TextInput/TextInput';
import { SearchIcon } from '../../../../assets/icons';

interface CountryOption {
  label: string;
  value: string;
  dialCode: string;
  code: string;
  icon: React.ReactNode;
}

interface PhoneInputDropdownProps {
  isOpen: boolean;
  filteredOptions: CountryOption[];
  selectedValue: string;
  focusedIndex: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (value: string) => void;
  onFocusIndex: (index: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClose: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  styles: Record<string, any>;
}

export const PhoneInputDropdown = forwardRef<
  HTMLDivElement,
  PhoneInputDropdownProps
>(
  (
    {
      isOpen,
      filteredOptions,
      selectedValue,
      focusedIndex,
      searchQuery,
      onSearchChange,
      onSelect,
      onFocusIndex,
      onKeyDown,
      onClose,
      searchInputRef,
      triggerRef,
      styles
    },
    ref
  ) => {
    if (!isOpen) return null;

    const triggerRect = triggerRef?.current?.getBoundingClientRect();
    const contentWidth = triggerRect ? `${triggerRect.width}px` : '280px';

    return (
      <Portal>
        <Box
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          onClick={onClose}
          zIndex={999}
        />
        <Flex
          ref={ref}
          css={styles.content}
          position="absolute"
          zIndex={1000}
          top={triggerRect?.top ? triggerRect?.top + triggerRect?.height : 0}
          left={triggerRect?.left}
          width={contentWidth}
          role="listbox"
          aria-activedescendant={
            focusedIndex >= 0
              ? `phone-option-${filteredOptions[focusedIndex]?.value}`
              : undefined
          }
          direction="column"
        >
          <TextInput
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search countries..."
            size="md"
            autoFocus
            leftIcon={<SearchIcon />}
          />

          {filteredOptions.length === 0 ? (
            <Text css={styles.emptyState}>No countries found</Text>
          ) : (
            <Box css={styles.itemList} width={'100%'}>
              {filteredOptions.map((item, index) => {
                const isSelected = selectedValue === item.value;
                const isFocused = index === focusedIndex;

                return (
                  <Flex
                    key={item.value}
                    id={`phone-option-${item.value}`}
                    css={styles.item}
                    bg={
                      isSelected
                        ? 'green.50'
                        : isFocused
                          ? 'gray.50'
                          : 'transparent'
                    }
                    onClick={() => onSelect(item.value)}
                    onMouseEnter={() => onFocusIndex(index)}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={-1}
                  >
                    <Box css={styles.itemIcon}>{item.icon}</Box>
                    <Text as="span" css={styles.itemText}>
                      {item.label} {item.dialCode}
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
              })}
            </Box>
          )}
        </Flex>
      </Portal>
    );
  }
);

PhoneInputDropdown.displayName = 'PhoneInputDropdown';
