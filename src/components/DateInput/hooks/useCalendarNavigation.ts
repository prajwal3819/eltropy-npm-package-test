import { useState } from 'react';
import { addMonths, getToday } from '../utils/dateUtils';

type ViewMode = 'days' | 'months' | 'years';

export interface UseCalendarNavigationProps {
  initialMonth?: number;
  initialYear?: number;
}

export interface UseCalendarNavigationReturn {
  viewMode: ViewMode;
  currentMonth: number;
  currentYear: number;
  yearRangeStart: number;
  setViewMode: (mode: ViewMode) => void;
  handlePrevMonth: () => void;
  handleNextMonth: () => void;
  handleMonthSelect: (month: number) => void;
  handleYearSelect: (year: number) => void;
  setCurrentMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
}

export const useCalendarNavigation = ({
  initialMonth,
  initialYear,
}: UseCalendarNavigationProps = {}): UseCalendarNavigationReturn => {
  const today = getToday();

  const [viewMode, setViewMode] = useState<ViewMode>('days');
  const [currentMonth, setCurrentMonth] = useState(initialMonth ?? today.month);
  const [currentYear, setCurrentYear] = useState(initialYear ?? today.year);
  const [yearRangeStart, setYearRangeStart] = useState(
    (initialYear ?? today.year) - 11,
  );

  const handlePrevMonth = () => {
    if (viewMode === 'years') {
      setYearRangeStart(yearRangeStart - 12);
    } else {
      const newDate = addMonths(
        { year: currentYear, month: currentMonth, day: 1 },
        -1,
      );
      setCurrentMonth(newDate.month);
      setCurrentYear(newDate.year);
    }
  };

  const handleNextMonth = () => {
    if (viewMode === 'years') {
      setYearRangeStart(yearRangeStart + 12);
    } else {
      const newDate = addMonths(
        { year: currentYear, month: currentMonth, day: 1 },
        1,
      );
      setCurrentMonth(newDate.month);
      setCurrentYear(newDate.year);
    }
  };

  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month);
    setViewMode('days');
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode('days');
  };

  return {
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
  };
};
