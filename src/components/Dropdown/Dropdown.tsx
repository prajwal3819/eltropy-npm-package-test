import {
  forwardRef,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useSlotRecipe, Box, Flex, Text } from '@chakra-ui/react';
import { dropdownRecipe } from '../../theme/recipes/dropdown.recipe';
import { useDropdownFilter } from './hooks/useDropdownFilter';
import { useDropdownAsync } from './hooks/useDropdownAsync';
import { useDevice } from '../../hooks/useDevice';
import { DropdownLabel } from './components/DropdownLabel';
import { DropdownTrigger } from './components/DropdownTrigger';
import { DropdownContent } from './components/DropdownContent';
import { DropdownMobileContent } from './components/DropdownMobileContent';
import ErrorCircleIcon from '../../assets/icons/error-circle';
import {
  type DropdownProps,
  type DropdownSingleProps,
  type DropdownMultiProps,
  type DropdownAsyncSingleProps,
  type DropdownAsyncMultiProps,
  type DropdownOption,
} from './types';

// ── Type Guards ─────────────────────────────────────────────────────
const isAsyncProps = (
  props: DropdownProps,
): props is DropdownAsyncSingleProps | DropdownAsyncMultiProps => {
  return 'loadOptions' in props;
};

const isSingleProps = (
  props: DropdownProps,
): props is DropdownSingleProps | DropdownAsyncSingleProps => {
  return !props.mode || props.mode === 'single';
};

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (props, ref) => {
    // ── Props Destructuring ───────────────────────────────────────────
    const {
      label,
      labelSubtext,
      placeholder = 'Select an option',
      disabled = false,
      required = false,
      optional = false,
      leftIcon,
      showLeftIcon = true,
      error,
      helperText,
      searchable = false,
      maxWidth = '400px',
      styleOverrides,
    } = props;

    const mode = props.mode || 'single';
    const isAsync = isAsyncProps(props);
    const isSingle = isSingleProps(props);
    const overflowCount =
      !isSingle && 'overflowCount' in props
        ? ((props as DropdownMultiProps).overflowCount ?? false)
        : false;
    const selectedOnTop =
      !isSingle && 'selectedOnTop' in props
        ? ((props as DropdownMultiProps).selectedOnTop ?? false)
        : false;
    const virtualizationThreshold =
      !isSingle && 'virtualizationThreshold' in props
        ? ((props as DropdownMultiProps).virtualizationThreshold ?? 100)
        : 100;

    // ── Hooks ─────────────────────────────────────────────────────────
    const { isMobile } = useDevice();

    const recipe = useSlotRecipe({ recipe: dropdownRecipe });
    const styles = recipe({ isError: !!error });

    const asyncResult = useDropdownAsync({
      loadOptions: isAsync ? props.loadOptions : async () => [],
      debounceMs: isAsync ? props.debounceMs : 300,
    });

    const { searchQuery, setSearchQuery, filteredOptions, resetSearch } =
      useDropdownFilter({
        options: isAsync
          ? asyncResult.options
          : (props as DropdownSingleProps | DropdownMultiProps).options,
        searchable,
      });

    // ── Refs & Local State ────────────────────────────────────────────
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [openSnapshotValues, setOpenSnapshotValues] = useState<string[]>([]);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const triggerSearchInputRef = useRef<HTMLInputElement>(null);

    // ── Derived Values ────────────────────────────────────────────────
    const resolvedOptions: DropdownOption[] = isAsync
      ? asyncResult.options
      : (props as DropdownSingleProps | DropdownMultiProps).options;

    const resolvedLoading = isAsync ? asyncResult.loading : false;

    const selectedValues = useMemo(() => {
      if (isSingle) {
        const val = (props as DropdownSingleProps).value;
        return val ? [val] : [];
      }
      return (props as DropdownMultiProps).value || [];
    }, [isSingle, props]);

    const selectedOptions = useMemo(
      () => resolvedOptions.filter((opt) => selectedValues.includes(opt.value)),
      [resolvedOptions, selectedValues],
    );

    const selectedOption = useMemo(
      () =>
        isSingle
          ? resolvedOptions.find((opt) => opt.value === selectedValues[0])
          : undefined,
      [isSingle, resolvedOptions, selectedValues],
    );

    const sortedFilteredOptions = useMemo(() => {
      if (!selectedOnTop || isSingle) return filteredOptions;
      const snapshotSet = new Set(openSnapshotValues);
      const selected = filteredOptions.filter((opt) => snapshotSet.has(opt.value));
      const unselected = filteredOptions.filter((opt) => !snapshotSet.has(opt.value));
      return [...selected, ...unselected];
    }, [selectedOnTop, isSingle, filteredOptions, openSnapshotValues]);

    // ── Handlers ──────────────────────────────────────────────────────
    const handleSelect = useCallback(
      (selectedValue: string) => {
        if (isSingle) {
          (props as DropdownSingleProps).onChange?.(selectedValue);
          setIsOpen(false);
          resetSearch();
          setFocusedIndex(-1);
          triggerRef.current?.focus();
        } else {
          const currentValues = (props as DropdownMultiProps).value || [];
          const newValues = currentValues.includes(selectedValue)
            ? currentValues.filter((v) => v !== selectedValue)
            : [...currentValues, selectedValue];
          (props as DropdownMultiProps).onChange?.(newValues);
        }
      },
      [isSingle, props, resetSearch],
    );

    const handleRemoveTag = useCallback(
      (valueToRemove: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isSingle) {
          const currentValues = (props as DropdownMultiProps).value || [];
          (props as DropdownMultiProps).onChange?.(
            currentValues.filter((v) => v !== valueToRemove),
          );
        }
      },
      [isSingle, props],
    );

    const handleSelectAll = useCallback(() => {
      if (isSingle) return;
      const allFilteredValues = filteredOptions.map((opt) => opt.value);
      const currentValues = (props as DropdownMultiProps).value || [];
      const allSelected = allFilteredValues.every((v) => currentValues.includes(v));
      if (allSelected) {
        const remaining = currentValues.filter((v) => !allFilteredValues.includes(v));
        (props as DropdownMultiProps).onChange?.(remaining);
      } else {
        const merged = Array.from(new Set([...currentValues, ...allFilteredValues]));
        (props as DropdownMultiProps).onChange?.(merged);
      }
    }, [isSingle, filteredOptions, props]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
          case 'Enter':
          case ' ':
            if (!isOpen) {
              e.preventDefault();
              setIsOpen(true);
            } else if (
              focusedIndex >= 0 &&
              focusedIndex < filteredOptions.length
            ) {
              e.preventDefault();
              handleSelect(filteredOptions[focusedIndex].value);
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (!isOpen) {
              setIsOpen(true);
            } else {
              setFocusedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : 0,
              );
            }
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (isOpen) {
              setFocusedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredOptions.length - 1,
              );
            }
            break;
          case 'Escape':
            e.preventDefault();
            setIsOpen(false);
            setFocusedIndex(-1);
            triggerRef.current?.focus();
            break;
          case 'Tab':
            if (isOpen) {
              setIsOpen(false);
              setFocusedIndex(-1);
            }
            break;
        }
      },
      [disabled, isOpen, focusedIndex, filteredOptions, handleSelect],
    );

    const handleToggle = useCallback(() => {
      setIsOpen((prev) => {
        if (!prev && selectedOnTop) {
          setOpenSnapshotValues([...selectedValues]);
        }
        return !prev;
      });
    }, [selectedOnTop, selectedValues]);

    const handleClose = useCallback(() => {
      setIsOpen(false);
      setFocusedIndex(-1);
      resetSearch();
    }, [resetSearch]);

    const handleSearchChange = useCallback(
      (value: string) => {
        setSearchQuery(value);
        if (isAsync) {
          asyncResult.fetchOptions(value);
        }
      },
      [setSearchQuery, isAsync, asyncResult],
    );

    // ── Effects ───────────────────────────────────────────────────────
    useEffect(() => {
      if (!isOpen) return;
      if (mode === 'multi' && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      } else if (
        mode === 'single' &&
        searchable &&
        triggerSearchInputRef.current
      ) {
        triggerSearchInputRef.current.focus();
      }
    }, [isOpen, mode, searchable]);

    useEffect(() => {
      if (!isOpen) {
        setFocusedIndex(-1);
        resetSearch();
      }
    }, [isOpen, resetSearch]);

    // ── Computed Props ────────────────────────────────────────────────
    const contentProps = useMemo(
      () => ({
        isOpen,
        mode,
        filteredOptions: sortedFilteredOptions,
        selectedValues,
        focusedIndex,
        searchable,
        searchQuery,
        onSearchChange: handleSearchChange,
        onSelect: handleSelect,
        onSelectAll: !isSingle ? handleSelectAll : undefined,
        onFocusIndex: setFocusedIndex,
        onKeyDown: handleKeyDown,
        onClose: handleClose,
        loading: resolvedLoading,
        searchInputRef,
        styles,
        virtualizationThreshold,
      }),
      [
        isOpen,
        mode,
        sortedFilteredOptions,
        selectedValues,
        focusedIndex,
        searchable,
        searchQuery,
        handleSearchChange,
        handleSelect,
        handleSelectAll,
        handleKeyDown,
        handleClose,
        resolvedLoading,
        styles,
        isSingle,
        virtualizationThreshold,
      ],
    );

    // ── Render ────────────────────────────────────────────────────────
    return (
      <Box
        ref={ref}
        css={styles.root}
        maxWidth={maxWidth}
        style={styleOverrides?.root}
      >
        <DropdownLabel
          label={label}
          labelSubtext={labelSubtext}
          required={required}
          optional={optional}
          styles={styles}
        />

        <Box position="relative">
          <DropdownTrigger
            ref={triggerRef}
            isOpen={isOpen}
            disabled={disabled}
            placeholder={placeholder}
            leftIcon={leftIcon}
            showLeftIcon={showLeftIcon}
            mode={mode}
            selectedOption={selectedOption}
            selectedOptions={selectedOptions}
            overflowCount={overflowCount}
            searchable={isSingle ? searchable : false}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onToggle={handleToggle}
            onKeyDown={handleKeyDown}
            onRemoveTag={handleRemoveTag}
            inputRef={triggerSearchInputRef}
            styles={styles}
          />

          {isMobile ? (
            <DropdownMobileContent
              ref={contentRef}
              {...contentProps}
              leftIcon={leftIcon}
            />
          ) : (
            <DropdownContent
              ref={contentRef}
              {...contentProps}
              triggerRef={triggerRef}
              styleOverrides={styleOverrides?.content}
            />
          )}
        </Box>

        {error && (
          <Flex css={styles.errorContainer} style={styleOverrides?.error}>
            <Box css={styles.errorIcon}>
              <ErrorCircleIcon
                width="1em"
                height="1em"
                style={{ width: '100%', height: '100%' }}
              />
            </Box>
            <Text as="p" css={styles.errorText}>
              {error}
            </Text>
          </Flex>
        )}
        {!error && helperText && (
          <Text
            as="p"
            css={styles.helperText}
            style={styleOverrides?.helperText}
          >
            {helperText}
          </Text>
        )}
      </Box>
    );
  },
);

Dropdown.displayName = 'Dropdown';
