import { useState, useCallback } from 'react';
import type { DateValue } from '../utils/dateUtils';
import {
  formatDate,
  parseDate,
  isDateBefore,
  isDateAfter,
} from '../utils/dateUtils';
import {
  formatInputWithSeparators,
  validateDateInput,
  restrictToDateCharacters,
} from '../utils/inputFormatting';

export interface UseDateInputHandlersProps {
  mode: 'single' | 'range' | 'multiple';
  enableTyping: boolean;
  showFooter: boolean;
  dateFormat: string;
  minDateValue?: DateValue;
  maxDateValue?: DateValue;
  onDateClick: (date: DateValue) => void;
  onOpen: () => void;
  onClose: () => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  disabled?: boolean;
}

export interface UseDateInputHandlersReturn {
  inputValue: string;
  typingError: string | undefined;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleInputClick: () => void;
  handleCalendarIconClick: () => void;
  handleDateClickInternal: (date: DateValue) => void;
  handleClear: (clearSelection: () => void) => void;
  setInputValue: (value: string) => void;
  setTypingError: (error: string | undefined) => void;
}

export const useDateInputHandlers = ({
  mode,
  enableTyping,
  showFooter,
  dateFormat,
  minDateValue,
  maxDateValue,
  onDateClick,
  onOpen,
  onClose,
  setCurrentMonth,
  setCurrentYear,
  disabled = false,
}: UseDateInputHandlersProps): UseDateInputHandlersReturn => {
  const [inputValue, setInputValue] = useState('');
  const [typingError, setTypingError] = useState<string | undefined>();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!enableTyping) return;

      const rawValue = e.target.value;
      const restricted = restrictToDateCharacters(rawValue);

      const { formatted } = formatInputWithSeparators(restricted, dateFormat);
      setInputValue(formatted);

      if (typingError) setTypingError(undefined);

      const validation = validateDateInput(formatted, dateFormat);
      if (validation.isValid) {
        const parsed = parseDate(formatted, dateFormat);
        if (parsed && mode === 'single') {
          if (minDateValue && isDateBefore(parsed, minDateValue)) {
            return;
          }
          if (maxDateValue && isDateAfter(parsed, maxDateValue)) {
            return;
          }
          onDateClick(parsed);
          setCurrentMonth(parsed.month);
          setCurrentYear(parsed.year);
        }
      }
    },
    [
      enableTyping,
      dateFormat,
      typingError,
      mode,
      minDateValue,
      maxDateValue,
      onDateClick,
      setCurrentMonth,
      setCurrentYear,
    ],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && enableTyping) {
        const validation = validateDateInput(inputValue, dateFormat);
        if (!validation.isValid) {
          setTypingError(validation.error);
          return;
        }

        const parsed = parseDate(inputValue, dateFormat);
        if (parsed && mode === 'single') {
          if (minDateValue && isDateBefore(parsed, minDateValue)) {
            setTypingError(
              `Date must be after ${formatDate(minDateValue, dateFormat)}`,
            );
            return;
          }
          if (maxDateValue && isDateAfter(parsed, maxDateValue)) {
            setTypingError(
              `Date must be before ${formatDate(maxDateValue, dateFormat)}`,
            );
            return;
          }
          onDateClick(parsed);
          setCurrentMonth(parsed.month);
          setCurrentYear(parsed.year);
          setTypingError(undefined);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [
      enableTyping,
      inputValue,
      dateFormat,
      mode,
      minDateValue,
      maxDateValue,
      onDateClick,
      setCurrentMonth,
      setCurrentYear,
      onClose,
    ],
  );

  const handleBlur = useCallback(() => {
    if (!enableTyping || !inputValue) {
      setTypingError(undefined);
      return;
    }
    const validation = validateDateInput(inputValue, dateFormat);
    if (!validation.isValid) {
      setTypingError(validation.error);
    } else {
      const parsed = parseDate(inputValue, dateFormat);
      if (parsed) {
        if (minDateValue && isDateBefore(parsed, minDateValue)) {
          setTypingError(
            `Date must be after ${formatDate(minDateValue, dateFormat)}`,
          );
        } else if (maxDateValue && isDateAfter(parsed, maxDateValue)) {
          setTypingError(
            `Date must be before ${formatDate(maxDateValue, dateFormat)}`,
          );
        } else {
          setTypingError(undefined);
        }
      }
    }
  }, [enableTyping, inputValue, dateFormat, minDateValue, maxDateValue]);

  const handleInputClick = useCallback(() => {
    if (!disabled && !enableTyping) {
      onOpen();
    }
  }, [disabled, enableTyping, onOpen]);

  const handleCalendarIconClick = useCallback(() => {
    if (!disabled) {
      onOpen();
    }
  }, [disabled, onOpen]);

  const handleDateClickInternal = useCallback(
    (date: DateValue) => {
      onDateClick(date);
      if (mode === 'single' && enableTyping) {
        const formatted = formatDate(date, dateFormat);
        setInputValue(formatted);
        setTypingError(undefined);
      }
      if (mode === 'single' && !showFooter) {
        onClose();
      }
    },
    [onDateClick, mode, enableTyping, dateFormat, showFooter, onClose],
  );

  const handleClear = useCallback((clearSelection: () => void) => {
    clearSelection();
    setInputValue('');
    setTypingError(undefined);
  }, []);

  return {
    inputValue,
    typingError,
    handleInputChange,
    handleInputKeyDown,
    handleBlur,
    handleInputClick,
    handleCalendarIconClick,
    handleDateClickInternal,
    handleClear,
    setInputValue,
    setTypingError,
  };
};
