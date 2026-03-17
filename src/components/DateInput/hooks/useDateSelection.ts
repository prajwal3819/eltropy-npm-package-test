import { useState, useEffect, useCallback } from 'react';
import type { DateValue } from '../utils/dateUtils';
import {
  dateToDateValue,
  dateValueToDate,
  isSameDay,
  isDateBefore,
} from '../utils/dateUtils';

export type SelectionMode = 'single' | 'range' | 'multiple';

export interface UseDateSelectionProps {
  mode: SelectionMode;
  value?: Date | { from?: Date; to?: Date } | Date[];
  onChange?: (
    value: Date | { from?: Date; to?: Date } | Date[] | undefined,
  ) => void;
}

export interface UseDateSelectionReturn {
  selectedDate: DateValue | null;
  rangeStart: DateValue | null;
  rangeEnd: DateValue | null;
  selectedDates: DateValue[];
  handleDateClick: (date: DateValue) => void;
  clearSelection: () => void;
}

export const useDateSelection = ({
  mode,
  value,
  onChange,
}: UseDateSelectionProps): UseDateSelectionReturn => {
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
  const [rangeStart, setRangeStart] = useState<DateValue | null>(null);
  const [rangeEnd, setRangeEnd] = useState<DateValue | null>(null);
  const [selectedDates, setSelectedDates] = useState<DateValue[]>([]);

  useEffect(() => {
    if (value) {
      if (mode === 'single' && value instanceof Date) {
        setSelectedDate(dateToDateValue(value));
      } else if (
        mode === 'range' &&
        typeof value === 'object' &&
        'from' in value
      ) {
        if (value.from) setRangeStart(dateToDateValue(value.from));
        else setRangeStart(null);
        if (value.to) setRangeEnd(dateToDateValue(value.to));
        else setRangeEnd(null);
      } else if (mode === 'multiple' && Array.isArray(value)) {
        setSelectedDates(value.map(dateToDateValue));
      }
    } else {
      setSelectedDate(null);
      setRangeStart(null);
      setRangeEnd(null);
      setSelectedDates([]);
    }
  }, [value, mode]);

  const handleDateClick = useCallback(
    (date: DateValue) => {
      if (mode === 'single') {
        setSelectedDate(date);
        onChange?.(dateValueToDate(date));
      } else if (mode === 'range') {
        if (!rangeStart || (rangeStart && rangeEnd)) {
          setRangeStart(date);
          setRangeEnd(null);
          onChange?.({ from: dateValueToDate(date), to: undefined });
        } else {
          if (isDateBefore(date, rangeStart)) {
            setRangeEnd(rangeStart);
            setRangeStart(date);
            onChange?.({
              from: dateValueToDate(date),
              to: dateValueToDate(rangeStart),
            });
          } else {
            setRangeEnd(date);
            onChange?.({
              from: dateValueToDate(rangeStart),
              to: dateValueToDate(date),
            });
          }
        }
      } else if (mode === 'multiple') {
        const exists = selectedDates.some((d) => isSameDay(d, date));
        const newDates = exists
          ? selectedDates.filter((d) => !isSameDay(d, date))
          : [...selectedDates, date];
        setSelectedDates(newDates);
        onChange?.(newDates.map(dateValueToDate));
      }
    },
    [mode, rangeStart, rangeEnd, selectedDates, onChange],
  );

  const clearSelection = useCallback(() => {
    setSelectedDate(null);
    setRangeStart(null);
    setRangeEnd(null);
    setSelectedDates([]);
    onChange?.(undefined);
  }, [onChange]);

  return {
    selectedDate,
    rangeStart,
    rangeEnd,
    selectedDates,
    handleDateClick,
    clearSelection,
  };
};
