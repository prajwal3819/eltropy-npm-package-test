import { useState, useEffect, useCallback, useRef } from 'react';
import { type DropdownOption } from '../types';

interface UseDropdownAsyncProps {
  loadOptions: (query?: string) => Promise<DropdownOption[]>;
  debounceMs?: number;
}

interface UseDropdownAsyncReturn {
  options: DropdownOption[];
  loading: boolean;
  error: string | null;
  fetchOptions: (query?: string) => void;
}

export const useDropdownAsync = ({
  loadOptions,
  debounceMs = 300,
}: UseDropdownAsyncProps): UseDropdownAsyncReturn => {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const loadOptionsRef = useRef(loadOptions);

  useEffect(() => {
    loadOptionsRef.current = loadOptions;
  }, [loadOptions]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const fetchOptions = useCallback(
    (query?: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(async () => {
        if (!mountedRef.current) return;
        setLoading(true);
        setError(null);
        try {
          const results = await loadOptionsRef.current(query);
          if (mountedRef.current) {
            setOptions(results);
          }
        } catch (err) {
          if (mountedRef.current) {
            setError('Failed to load options');
            setOptions([]);
          }
        } finally {
          if (mountedRef.current) {
            setLoading(false);
          }
        }
      }, debounceMs);
    },
    [debounceMs],
  );

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  return {
    options,
    loading,
    error,
    fetchOptions,
  };
};
