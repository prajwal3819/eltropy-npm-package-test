import {
  Box,
  Flex,
  useSlotRecipe,
  useControllableState,
  chakra
} from '@chakra-ui/react';
import { forwardRef, useRef, useState } from 'react';
import { searchInputRecipe } from '../../../theme/recipes/search-input.recipe';
import type { HTMLChakraProps } from '@chakra-ui/react';
import { SearchIcon, CloseIcon, ErrorCircleIcon } from '../../../assets/icons';

export interface SearchInputProps extends Omit<
  HTMLChakraProps<'input'>,
  'size' | 'onChange' | 'onFocus' | 'onBlur'
> {
  size?: 'sm' | 'md' | 'lg';
  isInvalid?: boolean;
  errorMessage?: string;
  onClear?: () => void;
  onChange?: (value: string) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      size = 'md',
      onClear,
      disabled,
      isInvalid,
      errorMessage,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useControllableState<string>({
      value: value as string | undefined,
      defaultValue: (defaultValue as string) || '',
      onChange
    });

    const safeValue = inputValue || '';
    const hasValue = safeValue.length > 0;

    // Track focus state
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const localRef = useRef<HTMLInputElement>(null);

    const recipe = useSlotRecipe({ recipe: searchInputRecipe });
    const styles = recipe({
      size,
      hasRightIcon: hasValue
    });

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setInputValue('');
      onClear?.();
      localRef.current?.focus();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };

    return (
      <Flex
        css={styles.root}
        flexDirection="column"
        gap={isInvalid && errorMessage ? '8px' : '0'}
      >
        <Box
          position="relative"
          width="100%"
          display="flex"
          alignItems="center"
        >
          <Box
            css={styles.iconContainer}
            left="12px"
            pointerEvents="none"
            zIndex={2}
          >
            <Box
              as={SearchIcon}
              css={styles.searchIcon}
              data-focus={isFocused ? '' : undefined}
              data-hover={isHovered ? '' : undefined}
            />
          </Box>

          <Box
            as="input"
            ref={(node: HTMLInputElement | null) => {
              localRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref) {
                (
                  ref as React.MutableRefObject<HTMLInputElement | null>
                ).current = node;
              }
            }}
            css={styles.input}
            disabled={disabled}
            aria-disabled={disabled}
            aria-invalid={isInvalid}
            data-invalid={isInvalid ? '' : undefined}
            value={safeValue}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e as React.FocusEvent<HTMLInputElement>);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e as React.FocusEvent<HTMLInputElement>);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            width="100%"
            {...(props as any)}
          />

          {hasValue && (
            <chakra.button
              type="button"
              onClick={handleClear}
              css={styles.iconContainer}
              right="12px"
              zIndex={2}
              disabled={disabled}
            >
              <Box as={CloseIcon} css={styles.clearIcon} />
            </chakra.button>
          )}
        </Box>
        {isInvalid && errorMessage && (
          <Flex alignItems="center" gap="4px" width="100%">
            <Box
              as={ErrorCircleIcon}
              width="16px"
              height="16px"
              color="red.200"
            />
            <Box
              as="span"
              fontSize="12px"
              fontWeight="500"
              lineHeight="1.33"
              color="red.200"
            >
              {errorMessage}
            </Box>
          </Flex>
        )}
      </Flex>
    );
  }
);

SearchInput.displayName = 'SearchInput';
