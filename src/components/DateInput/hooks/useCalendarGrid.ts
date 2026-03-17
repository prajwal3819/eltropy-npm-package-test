import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  isSameDay,
  isDateBefore,
  isDateAfter,
  isDateInRange,
  getToday,
} from '../utils/dateUtils';
import type { DateValue } from '../utils/dateUtils';

export interface UseCalendarGridProps {
  days: (DateValue | null)[];
  selectedDate?: DateValue | null;
  rangeStart?: DateValue | null;
  rangeEnd?: DateValue | null;
  selectedDates?: DateValue[];
  mode: 'single' | 'range' | 'multiple';
  minDate?: DateValue;
  maxDate?: DateValue;
  disabledDates?: DateValue[];
  hoverDate?: DateValue | null;
  onDateClick: (date: DateValue) => void;
  onNavigateMonth?: (offset: number) => void;
  isMobile?: boolean;
}

const COLS = 7;

export const useCalendarGrid = ({
  days,
  selectedDate,
  rangeStart,
  rangeEnd,
  selectedDates = [],
  mode,
  minDate,
  maxDate,
  disabledDates = [],
  hoverDate,
  onDateClick,
  onNavigateMonth,
  isMobile = false,
}: UseCalendarGridProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const today = useMemo(() => getToday(), []);

  // ── Date State Checks ───────────────────────────────────────────
  const isDisabled = useCallback(
    (date: DateValue): boolean => {
      if (minDate && isDateBefore(date, minDate)) return true;
      if (maxDate && isDateAfter(date, maxDate)) return true;
      return disabledDates.some((d) => isSameDay(d, date));
    },
    [minDate, maxDate, disabledDates],
  );

  const isSelected = useCallback(
    (date: DateValue): boolean => {
      if (mode === 'single' && selectedDate)
        return isSameDay(date, selectedDate);
      if (mode === 'multiple')
        return selectedDates.some((d) => isSameDay(d, date));
      if (mode === 'range') {
        if (rangeStart && isSameDay(date, rangeStart)) return true;
        if (rangeEnd && isSameDay(date, rangeEnd)) return true;
      }
      return false;
    },
    [mode, selectedDate, selectedDates, rangeStart, rangeEnd],
  );

  const isInRange = useCallback(
    (date: DateValue): boolean => {
      if (mode !== 'range') return false;
      if (rangeStart && rangeEnd)
        return isDateInRange(date, rangeStart, rangeEnd);
      if (rangeStart && hoverDate && !rangeEnd) {
        const start = isDateBefore(hoverDate, rangeStart)
          ? hoverDate
          : rangeStart;
        const end = isDateBefore(hoverDate, rangeStart)
          ? rangeStart
          : hoverDate;
        return isDateInRange(date, start, end);
      }
      return false;
    },
    [mode, rangeStart, rangeEnd, hoverDate],
  );

  const isRangeStart = useCallback(
    (date: DateValue): boolean =>
      mode === 'range' && !!rangeStart && isSameDay(date, rangeStart),
    [mode, rangeStart],
  );

  const isRangeEnd = useCallback(
    (date: DateValue): boolean => {
      if (mode !== 'range') return false;
      if (rangeEnd) return isSameDay(date, rangeEnd);
      if (rangeStart && hoverDate && !rangeEnd) {
        return isDateBefore(hoverDate, rangeStart)
          ? isSameDay(date, rangeStart)
          : isSameDay(date, hoverDate);
      }
      return false;
    },
    [mode, rangeStart, rangeEnd, hoverDate],
  );

  // ── Row Boundary Sets ───────────────────────────────────────────
  const rowStartSet = useMemo(() => {
    const set = new Set<number>();
    for (let i = 0; i < days.length; i += COLS) set.add(i);
    return set;
  }, [days.length]);

  const rowEndSet = useMemo(() => {
    const set = new Set<number>();
    for (let i = COLS - 1; i < days.length; i += COLS) set.add(i);
    return set;
  }, [days.length]);

  // ── Focus Management ────────────────────────────────────────────
  useEffect(() => {
    if (focusedIndex >= 0 && buttonRefs.current[focusedIndex]) {
      buttonRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex]);

  const firstFocusableIndex = useMemo(
    () => days.findIndex((d) => d !== null && !isDisabled(d)),
    [days, isDisabled],
  );

  // ── Keyboard Navigation ─────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number, date: DateValue | null) => {
      if (!date) return;

      let newIndex = index;

      switch (e.key) {
        case 'ArrowLeft': {
          e.preventDefault();
          newIndex = index - 1;
          while (
            newIndex >= 0 &&
            (!days[newIndex] || isDisabled(days[newIndex]!))
          )
            newIndex--;
          if (newIndex < 0) onNavigateMonth?.(-1);
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          newIndex = index + 1;
          while (
            newIndex < days.length &&
            (!days[newIndex] || isDisabled(days[newIndex]!))
          )
            newIndex++;
          if (newIndex >= days.length) onNavigateMonth?.(1);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          newIndex = index - COLS;
          while (
            newIndex >= 0 &&
            (!days[newIndex] || isDisabled(days[newIndex]!))
          )
            newIndex -= COLS;
          if (newIndex < 0) onNavigateMonth?.(-1);
          break;
        }
        case 'ArrowDown': {
          e.preventDefault();
          newIndex = index + COLS;
          while (
            newIndex < days.length &&
            (!days[newIndex] || isDisabled(days[newIndex]!))
          )
            newIndex += COLS;
          if (newIndex >= days.length) onNavigateMonth?.(1);
          break;
        }
        case 'Home': {
          e.preventDefault();
          newIndex = 0;
          while (
            newIndex < days.length &&
            (!days[newIndex] || isDisabled(days[newIndex]!))
          )
            newIndex++;
          break;
        }
        case 'End': {
          e.preventDefault();
          newIndex = days.length - 1;
          while (
            newIndex >= 0 &&
            (!days[newIndex] || isDisabled(days[newIndex]!))
          )
            newIndex--;
          break;
        }
        case 'PageUp':
          e.preventDefault();
          onNavigateMonth?.(-1);
          return;
        case 'PageDown':
          e.preventDefault();
          onNavigateMonth?.(1);
          return;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!isDisabled(date)) onDateClick(date);
          return;
        default:
          return;
      }

      if (newIndex >= 0 && newIndex < days.length && days[newIndex]) {
        setFocusedIndex(newIndex);
      }
    },
    [days, isDisabled, onDateClick, onNavigateMonth],
  );

  // ── Style Getters ───────────────────────────────────────────────
  const getDayStyles = useCallback(
    (date: DateValue) => {
      const disabled = isDisabled(date);
      const selected = isSelected(date);
      const isToday = isSameDay(date, today);

      const base = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: isToday ? '700' : selected ? '500' : '400',
        color: disabled ? 'gray.400' : 'navyGray.700',
        bg: selected ? 'green.50' : 'transparent',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        outline: selected ? '1px solid' : 'none',
        outlineColor: selected ? 'green.200' : 'transparent',
        position: 'relative' as const,
        zIndex: 2,
        _hover: disabled ? {} : { bg: selected ? 'green.50' : 'gray.50' },
      };

      if (isMobile) {
        return {
          ...base,
          width: '100%',
          height: '100%',
          minWidth: '32px',
          minHeight: '32px',
          maxWidth: '48px',
          maxHeight: '48px',
          aspectRatio: '1',
        };
      }

      return { ...base, width: '34px', height: '34px' };
    },
    [isDisabled, isSelected, today, isMobile],
  );

  const getCellWrapperStyles = useCallback(
    (date: DateValue | null, index: number) => {
      if (!date) return {};

      const inRange = isInRange(date);
      const rangeStartDay = isRangeStart(date);
      const rangeEndDay = isRangeEnd(date);

      if (!inRange && !rangeStartDay && !rangeEndDay) return {};

      const prevDate = index > 0 ? days[index - 1] : null;
      const nextDate = index < days.length - 1 ? days[index + 1] : null;

      const prevInRange = prevDate
        ? isInRange(prevDate) || isRangeStart(prevDate)
        : false;
      const nextInRange = nextDate
        ? isInRange(nextDate) || isRangeEnd(nextDate)
        : false;

      const isFirstInRow = rowStartSet.has(index) || !prevInRange;
      const isLastInRow = rowEndSet.has(index) || !nextInRange;

      return {
        position: 'relative' as const,
        _before: {
          content: '""',
          position: 'absolute',
          top: '2px',
          left: 0,
          right: 0,
          bottom: '2px',
          bg: 'green.50',
          zIndex: 1,
          borderTopLeftRadius: isFirstInRow ? '4px' : '0',
          borderBottomLeftRadius: isFirstInRow ? '4px' : '0',
          borderTopRightRadius: isLastInRow ? '4px' : '0',
          borderBottomRightRadius: isLastInRow ? '4px' : '0',
        },
      };
    },
    [days, isInRange, isRangeStart, isRangeEnd, rowStartSet, rowEndSet],
  );

  // ── Layout Styles ───────────────────────────────────────────────
  const gridStyles = useMemo(
    () =>
      isMobile
        ? {
            templateColumns: 'repeat(7, 1fr)',
            gapX: '8px',
            gapY: '12px',
            width: '100%',
          }
        : { templateColumns: 'repeat(7, 34px)', gapY: '5px' },
    [isMobile],
  );

  const cellSizeStyles = useMemo(
    () =>
      isMobile
        ? {
            width: '100%',
            height: '100%',
            minWidth: '32px',
            minHeight: '32px',
            maxWidth: '48px',
            maxHeight: '48px',
            aspectRatio: '1',
          }
        : { width: '34px', height: '34px' },
    [isMobile],
  );

  // ── Tab Index Helper ────────────────────────────────────────────
  const getTabIndex = useCallback(
    (date: DateValue | null, index: number): number => {
      if (!date || isDisabled(date)) return -1;
      if (focusedIndex === index) return 0;
      if (focusedIndex === -1 && index === firstFocusableIndex) return 0;
      return -1;
    },
    [isDisabled, focusedIndex, firstFocusableIndex],
  );

  return {
    buttonRefs,
    focusedIndex,
    setFocusedIndex,
    isDisabled,
    isSelected,
    handleKeyDown,
    getDayStyles,
    getCellWrapperStyles,
    gridStyles,
    cellSizeStyles,
    getTabIndex,
  };
};
