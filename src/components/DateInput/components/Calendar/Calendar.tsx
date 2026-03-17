import { forwardRef, useState, useCallback } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';
import { MonthSelector, YearSelector } from './MonthYearSelector';
import type { DateValue } from '../../utils/dateUtils';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import type { RefObject } from 'react';

type ViewMode = 'days' | 'months' | 'years';

export interface CalendarProps {
  viewMode: ViewMode;
  currentYear: number;
  currentMonth: number;
  yearRangeStart: number;
  days: (DateValue | null)[];
  days2?: (DateValue | null)[];
  selectedDate?: DateValue | null;
  rangeStart?: DateValue | null;
  rangeEnd?: DateValue | null;
  selectedDates?: DateValue[];
  mode: 'single' | 'range' | 'multiple';
  minDate?: DateValue;
  maxDate?: DateValue;
  disabledDates?: DateValue[];
  numberOfMonths?: 1 | 2;
  onDateClick: (date: DateValue) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthSelect: (month: number) => void;
  onYearSelect: (year: number) => void;
  onViewModeChange: (mode: ViewMode) => void;
  showFooter?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
  isMobile?: boolean;
  months: string[];
  monthsShort: string[];
  daysOfWeek: string[];
  cancelLabel: string;
  saveLabel: string;
  returnFocusRef?: RefObject<HTMLElement>;
  calendarStyles?: Record<string, any>;
  showMonthDropdown?: boolean;
  showYearDropdown?: boolean;
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      viewMode,
      currentYear,
      currentMonth,
      yearRangeStart,
      days,
      days2,
      selectedDate,
      rangeStart,
      rangeEnd,
      selectedDates = [],
      mode,
      minDate,
      maxDate,
      disabledDates = [],
      numberOfMonths = 1,
      onDateClick,
      onPrevMonth,
      onNextMonth,
      onMonthSelect,
      onYearSelect,
      onViewModeChange,
      showFooter = true,
      onCancel,
      onSave,
      isMobile = false,
      months,
      monthsShort,
      daysOfWeek,
      cancelLabel,
      saveLabel,
      returnFocusRef,
      calendarStyles = {},
      showMonthDropdown = false,
      showYearDropdown = true,
    },
    ref,
  ) => {
    useFocusTrap(ref as RefObject<HTMLElement>, !isMobile, returnFocusRef);
    const [sharedHoverDate, setSharedHoverDate] = useState<DateValue | null>(
      null,
    );

    const handleDateHover = useCallback(
      (date: DateValue | null) => {
        if (mode === 'range') {
          setSharedHoverDate(date);
        }
      },
      [mode],
    );
    const defaultCalendarStyles = isMobile
      ? {
          display: 'flex',
          flexDirection: 'column' as const,
          gap: '16px',
          width: '100%',
        }
      : {
          display: 'flex',
          flexDirection: 'column' as const,
          padding: '16px',
          bg: 'white',
          borderRadius: '16px',
          boxShadow: '0px 7px 15px 0px rgba(30, 31, 33, 0.1)',
          width: numberOfMonths === 2 ? '575px' : '280px',
          position: 'absolute' as const,
          top: '100%',
          left: '0',
          zIndex: 1000,
          marginTop: '8px',
        };

    return (
      <Box
        ref={ref}
        {...defaultCalendarStyles}
        {...calendarStyles}
        role={isMobile ? undefined : 'dialog'}
        aria-modal={isMobile ? undefined : 'true'}
        aria-label="Date picker"
      >
        {numberOfMonths === 2 && viewMode === 'days' ? (
          <Flex gap="24px">
            <Box flex="1">
              <CalendarHeader
                year={currentYear}
                month={currentMonth}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                onMonthClick={() => onViewModeChange('months')}
                onYearClick={() => onViewModeChange('years')}
                months={months}
                showMonthDropdown={showMonthDropdown}
                showYearDropdown={showYearDropdown}
              />
              <CalendarGrid
                days={days}
                selectedDate={selectedDate}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                selectedDates={selectedDates}
                mode={mode}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                onDateClick={onDateClick}
                onDateHover={handleDateHover}
                sharedHoverDate={sharedHoverDate}
                isMobile={isMobile}
                daysOfWeek={daysOfWeek}
                months={months}
                onNavigateMonth={onPrevMonth}
              />
            </Box>
            <Box flex="1">
              <CalendarHeader
                year={currentMonth === 11 ? currentYear + 1 : currentYear}
                month={currentMonth === 11 ? 0 : currentMonth + 1}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                showNavigation={false}
                isMobile={isMobile}
                months={months}
                showMonthDropdown={false}
                showYearDropdown={false}
              />
              <CalendarGrid
                days={days2 || []}
                selectedDate={selectedDate}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                selectedDates={selectedDates}
                mode={mode}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                onDateClick={onDateClick}
                onDateHover={handleDateHover}
                sharedHoverDate={sharedHoverDate}
                isMobile={isMobile}
                daysOfWeek={daysOfWeek}
                months={months}
                onNavigateMonth={onNextMonth}
              />
            </Box>
          </Flex>
        ) : (
          <>
            <CalendarHeader
              year={currentYear}
              month={currentMonth}
              onPrevMonth={onPrevMonth}
              onNextMonth={onNextMonth}
              onMonthClick={() => onViewModeChange('months')}
              onYearClick={() => onViewModeChange('years')}
              months={months}
              isMobile={isMobile}
              showMonthDropdown={showMonthDropdown}
              showYearDropdown={showYearDropdown}
            />
            {viewMode === 'days' && (
              <CalendarGrid
                days={days}
                selectedDate={selectedDate}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                selectedDates={selectedDates}
                mode={mode}
                minDate={minDate}
                maxDate={maxDate}
                disabledDates={disabledDates}
                onDateClick={onDateClick}
                onDateHover={handleDateHover}
                sharedHoverDate={sharedHoverDate}
                isMobile={isMobile}
                daysOfWeek={daysOfWeek}
                months={months}
                onNavigateMonth={onPrevMonth}
              />
            )}
          </>
        )}

        {viewMode === 'months' && (
          <MonthSelector
            currentMonth={currentMonth}
            onMonthSelect={onMonthSelect}
            monthsShort={monthsShort}
          />
        )}

        {viewMode === 'years' && (
          <YearSelector
            currentYear={currentYear}
            yearRangeStart={yearRangeStart}
            onYearSelect={onYearSelect}
          />
        )}

        {showFooter && viewMode === 'days' && !isMobile && (
          <Flex
            alignItems="center"
            justifyContent="flex-end"
            gap="12px"
            width="100%"
          >
            <Box
              as="button"
              fontSize="12px"
              fontWeight="medium"
              color="navyGray.700"
              bg="transparent"
              border="none"
              cursor="pointer"
              padding="4px 8px"
              _hover={{ color: 'navyGray.500' }}
              onClick={onCancel}
            >
              {cancelLabel}
            </Box>
            <Box
              as="button"
              fontSize="12px"
              fontWeight="medium"
              color="green.200"
              bg="transparent"
              border="none"
              cursor="pointer"
              padding="4px 8px"
              _hover={{ color: 'green.300' }}
              onClick={onSave}
            >
              {saveLabel}
            </Box>
          </Flex>
        )}
      </Box>
    );
  },
);

Calendar.displayName = 'Calendar';
