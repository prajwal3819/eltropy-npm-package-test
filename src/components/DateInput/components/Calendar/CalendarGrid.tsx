import { useCallback } from 'react';
import { Grid, Box, Text } from '@chakra-ui/react';
import { useCalendarGrid } from '../../hooks/useCalendarGrid';
import type { DateValue } from '../../utils/dateUtils';

interface CalendarGridProps {
  days: (DateValue | null)[];
  selectedDate?: DateValue | null;
  rangeStart?: DateValue | null;
  rangeEnd?: DateValue | null;
  selectedDates?: DateValue[];
  mode: 'single' | 'range' | 'multiple';
  minDate?: DateValue;
  maxDate?: DateValue;
  disabledDates?: DateValue[];
  onDateClick: (date: DateValue) => void;
  onDateHover?: (date: DateValue | null) => void;
  sharedHoverDate?: DateValue | null;
  isMobile?: boolean;
  daysOfWeek: string[];
  months: string[];
  onNavigateMonth?: (offset: number) => void;
}

export const CalendarGrid = ({
  days,
  selectedDate,
  rangeStart,
  rangeEnd,
  selectedDates = [],
  mode,
  minDate,
  maxDate,
  disabledDates = [],
  onDateClick,
  onDateHover,
  sharedHoverDate,
  isMobile = false,
  daysOfWeek,
  months,
  onNavigateMonth,
}: CalendarGridProps) => {
  // ── Hook: all logic, state checks, styles ───────────────────────
  const {
    buttonRefs,
    setFocusedIndex,
    isDisabled,
    isSelected,
    handleKeyDown,
    getDayStyles,
    getCellWrapperStyles,
    gridStyles,
    cellSizeStyles,
    getTabIndex,
  } = useCalendarGrid({
    days,
    selectedDate,
    rangeStart,
    rangeEnd,
    selectedDates,
    mode,
    minDate,
    maxDate,
    disabledDates,
    hoverDate: sharedHoverDate,
    onDateClick,
    onNavigateMonth,
    isMobile,
  });

  // ── Hover Handlers ──────────────────────────────────────────────
  const handleMouseEnter = useCallback(
    (date: DateValue | null) => onDateHover?.(date),
    [onDateHover],
  );

  const handleMouseLeave = useCallback(
    () => onDateHover?.(null),
    [onDateHover],
  );

  // ── Aria Label ──────────────────────────────────────────────────
  const getAriaLabel = useCallback(
    (date: DateValue): string =>
      `${months[date.month]} ${date.day}, ${date.year}`,
    [months],
  );

  // ── Render ──────────────────────────────────────────────────────
  return (
    <Box width="100%">
      {/* Weekday Header Row */}
      <Grid {...gridStyles} mb="6px">
        {daysOfWeek.map((day) => (
          <Box
            key={day}
            {...cellSizeStyles}
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="12px"
            fontWeight="500"
            color="gray.500"
          >
            {day}
          </Box>
        ))}
      </Grid>

      {/* Day Cells */}
      <Grid {...gridStyles} role="grid">
        {days.map((date, index) => (
          <Box
            key={index}
            {...getCellWrapperStyles(date, index)}
            role="gridcell"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              as="button"
              {...(date ? getDayStyles(date) : cellSizeStyles)}
              ref={(el: HTMLButtonElement | null) => {
                buttonRefs.current[index] = el;
              }}
              onClick={() => date && !isDisabled(date) && onDateClick(date)}
              onKeyDown={(e) => handleKeyDown(e, index, date)}
              onMouseEnter={() => handleMouseEnter(date)}
              onMouseLeave={handleMouseLeave}
              onFocus={() => date && setFocusedIndex(index)}
              data-disabled={date ? isDisabled(date) : true}
              aria-label={date ? getAriaLabel(date) : undefined}
              aria-selected={date ? isSelected(date) : undefined}
              aria-disabled={date ? isDisabled(date) : true}
              tabIndex={getTabIndex(date, index)}
              border="none"
              _focus={{
                outline: '2px solid',
                outlineColor: 'green.200',
                outlineOffset: '2px',
              }}
            >
              {date && <Text as="span">{date.day}</Text>}
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};
