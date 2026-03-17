import {
  forwardRef,
  cloneElement,
  isValidElement,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { chakra, Box, Flex, Text } from '@chakra-ui/react';
import ChevronDownIcon from '../../../assets/icons/chevron-down';
import CloseIcon from '../../../assets/icons/close';
import { type DropdownOption } from '../types';

interface DropdownTriggerProps {
  isOpen: boolean;
  disabled: boolean;
  placeholder: string;
  leftIcon?: React.ReactElement;
  showLeftIcon?: boolean;
  mode: 'single' | 'multi';
  selectedOption?: DropdownOption;
  selectedOptions?: DropdownOption[];
  overflowCount?: boolean;
  searchable?: boolean;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onRemoveTag?: (value: string, e: React.MouseEvent) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  styles: Record<string, any>;
}

export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(
  (
    {
      isOpen,
      disabled,
      placeholder,
      leftIcon,
      showLeftIcon = true,
      mode,
      selectedOption,
      selectedOptions = [],
      overflowCount: showOverflowCount = false,
      searchable,
      searchQuery,
      onSearchChange,
      onToggle,
      onKeyDown,
      onRemoveTag,
      inputRef,
      styles,
    },
    ref,
  ) => {
    // ── Refs & State ──────────────────────────────────────────────
    const tagsContainerRef = useRef<HTMLDivElement>(null);
    const [hiddenCount, setHiddenCount] = useState(0);

    // ── Overflow Detection ────────────────────────────────────────
    const calculateOverflow = useCallback(() => {
      const container = tagsContainerRef.current;
      if (!container || !showOverflowCount) {
        setHiddenCount(0);
        return;
      }

      const containerRight = container.getBoundingClientRect().right;
      const children = Array.from(container.children) as HTMLElement[];
      let count = 0;

      for (const child of children) {
        if (child.dataset.overflowBadge === 'true') continue;
        const childRight = child.getBoundingClientRect().right;
        if (childRight > containerRight + 1) {
          count++;
        }
      }

      setHiddenCount(count);
    }, [showOverflowCount]);

    // ── Effects ───────────────────────────────────────────────────
    useEffect(() => {
      calculateOverflow();
    }, [selectedOptions, calculateOverflow]);

    useEffect(() => {
      if (!showOverflowCount || !tagsContainerRef.current) return;

      const observer = new ResizeObserver(() => {
        calculateOverflow();
      });

      observer.observe(tagsContainerRef.current);
      return () => observer.disconnect();
    }, [showOverflowCount, calculateOverflow]);

    // ── Render Helpers ────────────────────────────────────────────
    const renderLeftIcon = () => {
      if (!showLeftIcon || !leftIcon || !isValidElement(leftIcon)) return null;
      return (
        <Box css={styles.triggerIcon}>
          {cloneElement(
            leftIcon as React.ReactElement<{
              width?: string;
              height?: string;
            }>,
            { width: '100%', height: '100%' },
          )}
        </Box>
      );
    };

    const renderSingleContent = () => {
      if (searchable && isOpen) {
        return (
          <chakra.input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            css={styles.searchInput}
            flex={1}
          />
        );
      }

      return (
        <Text
          as="span"
          css={styles.triggerText}
          color={selectedOption ? undefined : 'gray.400'}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      );
    };

    const renderMultiContent = () => {
      if (selectedOptions.length === 0) {
        return (
          <Text as="span" css={styles.triggerText} color="gray.400">
            {placeholder}
          </Text>
        );
      }

      return (
        <Flex css={styles.triggerTagsContainer} ref={tagsContainerRef}>
          {selectedOptions.map((opt) => (
            <Flex key={opt.value} css={styles.triggerTag}>
              <Text as="span" css={styles.triggerTagLabel}>
                {opt.label}
              </Text>
              <Box
                as="span"
                css={styles.triggerTagClose}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onRemoveTag?.(opt.value, e);
                }}
                role="button"
                aria-label={`Remove ${opt.label}`}
                tabIndex={-1}
              >
                <CloseIcon width="1em" height="1em" />
              </Box>
            </Flex>
          ))}
        </Flex>
      );
    };

    // ── Render ────────────────────────────────────────────────────
    return (
      <chakra.button
        ref={ref}
        type="button"
        css={styles.trigger}
        onClick={() => !disabled && onToggle()}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={disabled}
        disabled={disabled}
      >
        {renderLeftIcon()}
        {mode === 'single' ? renderSingleContent() : renderMultiContent()}
        {showOverflowCount && hiddenCount > 0 && (
          <Flex css={styles.triggerOverflowTag} flexShrink={0}>
            <Text as="span" css={styles.triggerOverflowTagLabel}>
              {hiddenCount}+
            </Text>
          </Flex>
        )}
        <Box css={styles.triggerIndicator}>
          <ChevronDownIcon
            width="1em"
            height="1em"
            style={{
              width: '100%',
              height: '100%',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </Box>
      </chakra.button>
    );
  },
);

DropdownTrigger.displayName = 'DropdownTrigger';
