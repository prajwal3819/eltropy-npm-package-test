import { useState, useMemo, useCallback } from 'react';
import { type DropdownOption } from '../types';

interface UseDropdownFilterProps {
  options: DropdownOption[];
  searchable?: boolean;
}

interface UseDropdownFilterReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredOptions: DropdownOption[];
  resetSearch: () => void;
}

export const useDropdownFilter = ({
  options,
  searchable = false,
}: UseDropdownFilterProps): UseDropdownFilterReturn => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [options, searchQuery, searchable]);

  const resetSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredOptions,
    resetSearch,
  };
};
