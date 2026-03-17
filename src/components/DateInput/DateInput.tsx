import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { Box } from '@chakra-ui/react';
import { DateInputField } from './components/Input';
import { Calendar } from './components/Calendar';
import { BottomSheet } from '../BottomSheet';
import {
  useCalendarTranslations,
  useDateSelection,
  useCalendarNavigation,
  useDateInputHandlers,
} from './hooks';
import type { Locale } from './hooks';
import {
  getCalendarDays,
  formatDate,
  dateToDateValue,
  getDaysOfWeek,
} from './utils/dateUtils';
import { useDevice } from '../../hooks/useDevice';

export interface DateInputProps {
  label?: string;
  labelSubtext?: string;
  placeholder?: string;
  value?: Date | { from?: Date; to?: Date } | Date[];
  onChange?: (
    value: Date | { from?: Date; to?: Date } | Date[] | undefined,
  ) => void;
  mode?: 'single' | 'range' | 'multiple';
  numberOfMonths?: 1 | 2;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  onCancel?: () => void;
  onSave?: () => void;
  showFooter?: boolean;
  enableTyping?: boolean;
  showClearButton?: boolean;
  locale?: Locale;
  inputStyles?: Record<string, any>;
  calendarStyles?: Record<string, any>;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
}

export const DateInput = forwardRef<HTMLDivElement, DateInputProps>(
  (
    {
      label,
      labelSubtext,
      placeholder = 'mm/dd/yyyy',
      value,
      onChange,
      mode = 'single',
      numberOfMonths = 1,
      required = false,
      optional,
      disabled = false,
      error,
      helperText,
      dateFormat = 'MM/DD/YYYY',
      minDate,
      maxDate,
      disabledDates = [],
      onCancel,
      onSave,
      showFooter = true,
      enableTyping = false,
      showClearButton = false,
      locale = 'en',
      inputStyles: customInputStyles,
      calendarStyles,
      showMonthDropdown = false,
      showYearDropdown = true,
    },
    ref,
  ) => {
    // ── Hooks ──────────────────────────────────────────────────────────
    const { isMobile } = useDevice();
    const translations = useCalendarTranslations(locale);

    const {
      selectedDate,
      rangeStart,
      rangeEnd,
      selectedDates,
      handleDateClick,
      clearSelection,
    } = useDateSelection({ mode, value, onChange });

    const {
      viewMode,
      currentMonth,
      currentYear,
      yearRangeStart,
      setViewMode,
      handlePrevMonth,
      handleNextMonth,
      handleMonthSelect,
      handleYearSelect,
      setCurrentMonth,
      setCurrentYear,
    } = useCalendarNavigation();

    // ── Refs & Local State ────────────────────────────────────────────
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const calendarRef = useRef<HTMLDivElement>(null);
    const inputTriggerRef = useRef<HTMLDivElement>(null);

    // ── Derived Values ────────────────────────────────────────────────
    const minDateValue = useMemo(
      () => (minDate ? dateToDateValue(minDate) : undefined),
      [minDate],
    );
    const maxDateValue = useMemo(
      () => (maxDate ? dateToDateValue(maxDate) : undefined),
      [maxDate],
    );
    const disabledDateValues = useMemo(
      () => disabledDates.map(dateToDateValue),
      [disabledDates],
    );

    // ── Calendar Open / Close ─────────────────────────────────────────
    const openCalendar = useCallback(() => {
      setIsOpen(true);
      setViewMode('days');
    }, [setViewMode]);

    const closeCalendar = useCallback(() => {
      setIsOpen(false);
    }, []);

    // ── Input Handlers (from hook) ────────────────────────────────────
    const {
      inputValue,
      typingError,
      handleInputChange,
      handleInputKeyDown,
      handleBlur,
      handleInputClick,
      handleCalendarIconClick,
      handleDateClickInternal,
      handleClear: handleClearInternal,
      setInputValue,
    } = useDateInputHandlers({
      mode,
      enableTyping,
      showFooter,
      dateFormat,
      minDateValue,
      maxDateValue,
      onDateClick: handleDateClick,
      onOpen: openCalendar,
      onClose: closeCalendar,
      setCurrentMonth,
      setCurrentYear,
      disabled,
    });

    const displayError = enableTyping ? typingError : error;

    // ── Action Handlers ───────────────────────────────────────────────
    const handleCancel = useCallback(() => {
      setIsOpen(false);
      onCancel?.();
    }, [onCancel]);

    const handleSave = useCallback(() => {
      setIsOpen(false);
      onSave?.();
    }, [onSave]);

    const handleClear = useCallback(() => {
      handleClearInternal(clearSelection);
    }, [handleClearInternal, clearSelection]);

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (
          !isMobile &&
          containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          calendarRef.current &&
          !calendarRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      },
      [isMobile],
    );

    // ── Effects ───────────────────────────────────────────────────────
    useEffect(() => {
      if (mode === 'single' && selectedDate && enableTyping) {
        setInputValue(formatDate(selectedDate, dateFormat));
      }
    }, [selectedDate, mode, enableTyping, dateFormat, setInputValue]);

    useEffect(() => {
      if (isOpen && !isMobile) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, isMobile, handleClickOutside]);

    useEffect(() => {
      if (!isOpen) return;
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen && inputTriggerRef.current) {
        inputTriggerRef.current.focus();
      }
    }, [isOpen]);

    // ── Display Value (memoized) ──────────────────────────────────────
    const displayValue = useMemo(() => {
      if (enableTyping && inputValue) return inputValue;
      if (mode === 'single' && selectedDate) {
        return formatDate(selectedDate, dateFormat);
      }
      if (mode === 'range' && rangeStart) {
        const start = formatDate(rangeStart, dateFormat);
        return rangeEnd
          ? `${start} - ${formatDate(rangeEnd, dateFormat)}`
          : start;
      }
      if (mode === 'multiple' && selectedDates.length > 0) {
        return selectedDates.map((d) => formatDate(d, dateFormat)).join(', ');
      }
      return '';
    }, [
      enableTyping,
      inputValue,
      mode,
      selectedDate,
      rangeStart,
      rangeEnd,
      selectedDates,
      dateFormat,
    ]);

    // ── Input State ───────────────────────────────────────────────────
    const inputState = useMemo(() => {
      if (disabled) return 'disabled';
      if (displayError) return 'error';
      if (isOpen) return 'typing';
      if (displayValue) return 'filled';
      return 'default';
    }, [disabled, displayError, isOpen, displayValue]);

    // ── Styles ────────────────────────────────────────────────────────
    const getBackgroundColor = () => {
      return disabled ? 'gray.100' : 'white';
    };

    const getBorderColor = () => {
      if (displayError) return 'red.200';
      if (inputState === 'typing') return 'navyGray.300';
      return 'gray.200';
    };

    const getTextColor = () => {
      return disabled ? 'gray.400' : 'navyGray.700';
    };

    const getCursor = () => {
      return disabled ? 'not-allowed' : 'pointer';
    };

    const getHoverStyles = () => {
      if (disabled) return {};
      return {
        borderColor: displayError ? 'red.200' : 'successGreen.200',
      };
    };

    const getFocusStyles = () => {
      if (disabled) return {};
      return {
        borderColor: displayError ? 'red.200' : 'navyGray.300',
        borderWidth: '1px',
      } ;
    };

    const getFocusVisibleStyles = () => {
      if (disabled) return {};
      return {
        borderColor: displayError ? 'red.200' : 'navyGray.300',
        borderWidth: '2px',
        outline: 'none',
      };
    };

    const inputStyles = useMemo(
      () => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '40px',
        overflow: 'hidden',
        width: '100%',
        padding: '12px',
        bg: getBackgroundColor(),
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: getBorderColor(),
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: 'regular',
        color: getTextColor(),
        lineHeight: '20px',
        cursor: getCursor(),
        transition: 'all 0.2s',
        _hover: getHoverStyles(),
        _focus: getFocusStyles(),
        _focusVisible: getFocusVisibleStyles(),
        ...customInputStyles,
      }),
      [
        getBackgroundColor,
        getBorderColor,
        getTextColor,
        getCursor,
        getHoverStyles,
        getFocusStyles,
        getFocusVisibleStyles,
        customInputStyles,
      ],
    );

    // ── Calendar Data (memoized) ──────────────────────────────────────
    const days = useMemo(
      () =>
        getCalendarDays(currentYear, currentMonth, translations.weekStartsOn),
      [currentYear, currentMonth, translations.weekStartsOn],
    );

    const days2 = useMemo(
      () =>
        numberOfMonths === 2
          ? getCalendarDays(
              currentMonth === 11 ? currentYear + 1 : currentYear,
              currentMonth === 11 ? 0 : currentMonth + 1,
              translations.weekStartsOn,
            )
          : [],
      [numberOfMonths, currentMonth, currentYear, translations.weekStartsOn],
    );

    const daysOfWeek = useMemo(
      () => getDaysOfWeek(translations.weekStartsOn),
      [translations.weekStartsOn],
    );

    // ── Calendar Props ────────────────────────────────────────────────
    const calendarProps = useMemo(
      () => ({
        viewMode,
        currentYear,
        currentMonth,
        yearRangeStart,
        days,
        days2,
        selectedDate,
        rangeStart,
        rangeEnd,
        selectedDates,
        mode,
        minDate: minDateValue,
        maxDate: maxDateValue,
        disabledDates: disabledDateValues,
        numberOfMonths,
        onDateClick: handleDateClickInternal,
        onPrevMonth: handlePrevMonth,
        onNextMonth: handleNextMonth,
        onMonthSelect: handleMonthSelect,
        onYearSelect: handleYearSelect,
        onViewModeChange: setViewMode,
        showFooter,
        onCancel: handleCancel,
        onSave: handleSave,
        isMobile,
        months: translations.months,
        monthsShort: translations.monthsShort,
        daysOfWeek,
        cancelLabel: translations.cancel,
        saveLabel: translations.save,
        returnFocusRef: inputTriggerRef as React.RefObject<HTMLElement>,
        calendarStyles,
        showMonthDropdown,
        showYearDropdown,
      }),
      [
        viewMode,
        currentYear,
        currentMonth,
        yearRangeStart,
        days,
        days2,
        selectedDate,
        rangeStart,
        rangeEnd,
        selectedDates,
        mode,
        minDateValue,
        maxDateValue,
        disabledDateValues,
        numberOfMonths,
        handleDateClickInternal,
        handlePrevMonth,
        handleNextMonth,
        handleMonthSelect,
        handleYearSelect,
        setViewMode,
        showFooter,
        handleCancel,
        handleSave,
        isMobile,
        translations,
        daysOfWeek,
        calendarStyles,
        showMonthDropdown,
        showYearDropdown,
      ],
    );

    // ── Render ────────────────────────────────────────────────────────
    return (
      <Box ref={ref} position="relative" width="fit-content">
        <DateInputField
          ref={containerRef}
          label={label}
          labelSubtext={labelSubtext}
          placeholder={placeholder}
          value={displayValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onClick={handleInputClick}
          onBlur={handleBlur}
          onIconClick={handleCalendarIconClick}
          onClearClick={handleClear}
          required={required}
          disabled={disabled}
          error={displayError}
          helperText={helperText}
          enableTyping={enableTyping}
          showClearButton={showClearButton}
          inputStyles={inputStyles}
          optional={optional}
        />

        {isMobile ? (
          <BottomSheet
            isOpen={isOpen}
            onClose={closeCalendar}
            onCancel={handleCancel}
            onConfirm={handleSave}
            showHandle
            showCancelButton={showFooter}
            showConfirmButton={showFooter}
            cancelLabel={translations.cancel}
            confirmLabel={translations.done}
            minHeight="400px"
            maxHeight="90vh"
          >
            <Calendar {...calendarProps} />
          </BottomSheet>
        ) : (
          isOpen && <Calendar ref={calendarRef} {...calendarProps} />
        )}
      </Box>
    );
  },
);

DateInput.displayName = 'DateInput';
