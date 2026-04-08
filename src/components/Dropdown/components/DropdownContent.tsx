import { forwardRef, useRef, useCallback } from 'react';
import { Portal, Box, Flex, Text } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { DropdownSearchInput } from './DropdownSearchInput';
import { DropdownItem } from './DropdownItem';
import { Checkbox } from '../../Checkbox';
import { type DropdownOption } from '../types';

const ITEM_HEIGHT = 40;
const DEFAULT_VIRTUALIZATION_THRESHOLD = 100;

interface DropdownContentProps {
  isOpen: boolean;
  mode: 'single' | 'multi';
  filteredOptions: DropdownOption[];
  selectedValues: string[];
  focusedIndex: number;
  searchable: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelect: (value: string) => void;
  onSelectAll?: () => void;
  onFocusIndex: (index: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onClose: () => void;
  loading?: boolean;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  styles: Record<string, any>;
  styleOverrides?: React.CSSProperties;
  idPrefix?: string;
  virtualizationThreshold?: number;
}

export const DropdownContent = forwardRef<HTMLDivElement, DropdownContentProps>(
  (
    {
      isOpen,
      mode,
      filteredOptions,
      selectedValues,
      focusedIndex,
      searchable,
      searchQuery,
      onSearchChange,
      onSelect,
      onSelectAll,
      onFocusIndex,
      onKeyDown,
      onClose,
      loading,
      searchInputRef,
      triggerRef,
      styles,
      styleOverrides,
      idPrefix = 'dropdown',
      virtualizationThreshold = DEFAULT_VIRTUALIZATION_THRESHOLD,
    },
    ref,
  ) => {
    const listParentRef = useRef<HTMLDivElement>(null);

    const shouldVirtualize = filteredOptions.length >= virtualizationThreshold;

    const virtualizer = useVirtualizer({
      count: shouldVirtualize ? filteredOptions.length : 0,
      getScrollElement: () => listParentRef.current,
      estimateSize: () => ITEM_HEIGHT,
      overscan: 10,
    });

    const isAllSelected = useCallback(() => {
      if (filteredOptions.length === 0) return false;
      return filteredOptions.every((opt) => selectedValues.includes(opt.value));
    }, [filteredOptions, selectedValues]);

    if (!isOpen) return null;

    const isMulti = mode === 'multi';

    const triggerRect = triggerRef?.current?.getBoundingClientRect();
    const contentWidth = triggerRect ? `${triggerRect.width}px` : '100%';

    const renderItemList = () => {
      if (loading) {
        return <Text css={styles.loadingText}>Loading...</Text>;
      }

      if (filteredOptions.length === 0) {
        return <Text css={styles.emptyState}>No options found</Text>;
      }

      if (shouldVirtualize) {
        return (
          <Box
            ref={listParentRef}
            css={styles.itemList}
            style={{ maxHeight: '320px', overflow: 'auto' }}
          >
            <Box
              position="relative"
              width="100%"
              style={{ height: `${virtualizer.getTotalSize()}px` }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const item = filteredOptions[virtualItem.index];
                return (
                  <Box
                    key={item.value}
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <DropdownItem
                      item={item}
                      isSelected={selectedValues.includes(item.value)}
                      isFocused={virtualItem.index === focusedIndex}
                      onSelect={onSelect}
                      onMouseEnter={() => onFocusIndex(virtualItem.index)}
                      styles={styles}
                      idPrefix={idPrefix}
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      }

      return (
        <Box css={styles.itemList}>
          {filteredOptions.map((item, index) => (
            <DropdownItem
              key={item.value}
              item={item}
              isSelected={selectedValues.includes(item.value)}
              isFocused={index === focusedIndex}
              onSelect={onSelect}
              onMouseEnter={() => onFocusIndex(index)}
              styles={styles}
              idPrefix={idPrefix}
            />
          ))}
        </Box>
      );
    };

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
        <Box
          ref={ref}
          css={styles.content}
          style={styleOverrides}
          position="absolute"
          zIndex={1000}
          width={contentWidth}
          role="listbox"
          aria-multiselectable={isMulti || undefined}
          aria-activedescendant={
            focusedIndex >= 0
              ? `${idPrefix}-option-${filteredOptions[focusedIndex]?.value}`
              : undefined
          }
        >
          {isMulti && searchable && (
            <DropdownSearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChange={onSearchChange}
              onKeyDown={onKeyDown}
              placeholder="Search"
              styles={styles}
            />
          )}

          {isMulti && onSelectAll && (
            <Flex
              css={styles.selectAllRow}
              onClick={onSelectAll}
              role="option"
              aria-selected={isAllSelected()}
            >
              <Checkbox
                checked={isAllSelected()}
                size="md"
                onCheckedChange={onSelectAll}
              />
              <Text css={styles.selectAllLabel}>Select all</Text>
            </Flex>
          )}

          {renderItemList()}
        </Box>
      </Portal>
    );
  },
);

DropdownContent.displayName = 'DropdownContent';
