import { forwardRef } from 'react';
import { chakra, Box, Flex } from '@chakra-ui/react';
import SearchIcon from '../../../assets/icons/search';

interface DropdownSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  styles: Record<string, any>;
}

export const DropdownSearchInput = forwardRef<
  HTMLInputElement,
  DropdownSearchInputProps
>(({ value, onChange, onKeyDown, placeholder = 'Search', styles }, ref) => {
  return (
    <Flex css={styles.searchContainer}>
      <Box css={styles.searchIcon}>
        <SearchIcon
          width="1em"
          height="1em"
          style={{ width: '100%', height: '100%' }}
        />
      </Box>
      <chakra.input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        css={styles.searchInput}
        flex={1}
      />
    </Flex>
  );
});

DropdownSearchInput.displayName = 'DropdownSearchInput';
