import { forwardRef, useRef, useCallback, cloneElement, isValidElement } from 'react';
import { Box, Flex, Text, chakra } from '@chakra-ui/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { BottomSheet } from '../../BottomSheet';
import { Checkbox } from '../../Checkbox';
import SearchIcon from '../../../assets/icons/search';
import CheckmarkCircleIcon from '../../../assets/icons/checkmark-circle';
import { type DropdownOption } from '../types';

const ITEM_HEIGHT = 48;
const DEFAULT_VIRTUALIZATION_THRESHOLD = 100;

interface DropdownMobileContentProps {
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
  onConfirm?: () => void;
  loading?: boolean;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  leftIcon?: React.ReactElement;
  styles: Record<string, any>;
  idPrefix?: string;
  virtualizationThreshold?: number;
}

export const DropdownMobileContent = forwardRef<
  HTMLDivElement,
  DropdownMobileContentProps
>(
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
      onConfirm,
      loading,
      searchInputRef,
      leftIcon,
      styles,
      idPrefix = 'dropdown-mobile',
      virtualizationThreshold = DEFAULT_VIRTUALIZATION_THRESHOLD,
    },
    ref,
  ) => {
    const listParentRef = useRef<HTMLDivElement>(null);

    const isMulti = mode === 'multi';
    const isSingle = mode === 'single';

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

    const renderLeftIcon = (icon: React.ReactElement | undefined) => {
      if (!icon || !isValidElement(icon)) return null;
      return (
        <Box width="24px" height="24px" flexShrink={0} overflow="hidden">
          {cloneElement(
            icon as React.ReactElement<{
              width?: string;
              height?: string;
            }>,
            { width: '100%', height: '100%' },
          )}
        </Box>
      );
    };

    const renderSingleItem = (item: DropdownOption, index: number) => {
      const isSelected = selectedValues.includes(item.value);
      return (
        <Flex
          key={item.value}
          id={`${idPrefix}-option-${item.value}`}
          css={styles.mobileItem}
          gap="8px"
          bg={isSelected ? 'green.50' : 'transparent'}
          borderRadius={isSelected ? '4px' : '12px'}
          onClick={() => onSelect(item.value)}
          onMouseEnter={() => onFocusIndex(index)}
          role="option"
          aria-selected={isSelected}
        >
          {renderLeftIcon(item.icon)}
          <Text
            as="span"
            css={styles.mobileItemText}
            fontFamily={isSelected ? 'heading' : undefined}
            fontWeight={isSelected ? 'medium' : undefined}
          >
            {item.label}
          </Text>
          {isSelected && (
            <Box width="24px" height="24px" flexShrink={0} color="green.200">
              <CheckmarkCircleIcon
                width="1em"
                height="1em"
                style={{
                  width: '100%',
                  height: '100%',
                }}
              />
            </Box>
          )}
        </Flex>
      );
    };

    const renderMultiItem = (item: DropdownOption, index: number) => {
      const isSelected = selectedValues.includes(item.value);
      return (
        <Flex
          key={item.value}
          id={`${idPrefix}-option-${item.value}`}
          css={styles.mobileItem}
          gap="12px"
          bg={isSelected ? 'green.50' : 'transparent'}
          borderRadius="12px"
          onClick={() => onSelect(item.value)}
          onMouseEnter={() => onFocusIndex(index)}
          role="option"
          aria-selected={isSelected}
        >
          <Checkbox
            checked={isSelected}
            size="sm"
            onCheckedChange={() => onSelect(item.value)}
          />
          <Text
            as="span"
            css={styles.mobileItemText}
            fontFamily={isSelected ? 'heading' : undefined}
            fontWeight={isSelected ? 'medium' : undefined}
          >
            {item.label}
          </Text>
        </Flex>
      );
    };

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
            css={styles.mobileItemList}
            role="listbox"
            aria-multiselectable={isMulti || undefined}
            aria-activedescendant={
              focusedIndex >= 0
                ? `${idPrefix}-option-${filteredOptions[focusedIndex]?.value}`
                : undefined
            }
            style={{ maxHeight: '60vh', overflow: 'auto' }}
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
                    {isSingle
                      ? renderSingleItem(item, virtualItem.index)
                      : renderMultiItem(item, virtualItem.index)}
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
      }

      return (
        <Box
          css={styles.mobileItemList}
          role="listbox"
          aria-multiselectable={isMulti || undefined}
          aria-activedescendant={
            focusedIndex >= 0
              ? `${idPrefix}-option-${filteredOptions[focusedIndex]?.value}`
              : undefined
          }
        >
          {filteredOptions.map((item, index) =>
            isSingle
              ? renderSingleItem(item, index)
              : renderMultiItem(item, index),
          )}
        </Box>
      );
    };

    return (
      <BottomSheet
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={onConfirm}
        onCancel={onClose}
        showCancelButton={isMulti}
        showConfirmButton={isMulti}
        cancelLabel="Cancel"
        confirmLabel="Done"
        maxHeight="90vh"
      >
        <Flex flexDirection="column" gap={isMulti ? '16px' : '8px'}>
          {searchable && (
            <Flex css={styles.mobileSearchContainer}>
              {isSingle && leftIcon && renderLeftIcon(leftIcon)}
              <chakra.input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={onKeyDown}
                css={styles.mobileSearchInput}
                flex={1}
              />
              <Box css={styles.mobileSearchIcon}>
                <SearchIcon
                  width="1em"
                  height="1em"
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </Box>
            </Flex>
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
        </Flex>
      </BottomSheet>
    );
  },
);

DropdownMobileContent.displayName = 'DropdownMobileContent';
