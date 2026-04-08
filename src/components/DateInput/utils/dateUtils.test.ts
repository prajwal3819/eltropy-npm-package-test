import { describe, it, expect } from 'vitest';
import {
  getDaysOfWeek,
  createDate,
  getToday,
  isSameDay,
  isDateBefore,
  isDateAfter,
  isDateInRange,
  getDaysInMonth,
  getFirstDayOfMonth,
  getCalendarDays,
  formatDate,
  parseDate,
  addMonths,
  addYears,
  dateValueToDate,
  dateToDateValue,
} from './dateUtils';
import type { DateValue } from './dateUtils';

describe('dateUtils', () => {
  describe('getDaysOfWeek', () => {
    it('returns Sunday-first order by default', () => {
      const days = getDaysOfWeek();
      expect(days).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    });

    it('returns Monday-first order when weekStartsOn is 1', () => {
      const days = getDaysOfWeek(1);
      expect(days).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    });
  });

  describe('createDate', () => {
    it('creates a Date object from year, month, day', () => {
      const date = createDate(2025, 0, 15);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0);
      expect(date.getDate()).toBe(15);
    });
  });

  describe('getToday', () => {
    it('returns today as a DateValue', () => {
      const today = getToday();
      const now = new Date();
      expect(today.year).toBe(now.getFullYear());
      expect(today.month).toBe(now.getMonth());
      expect(today.day).toBe(now.getDate());
    });
  });

  describe('isSameDay', () => {
    it('returns true for identical dates', () => {
      const d1: DateValue = { year: 2025, month: 5, day: 15 };
      const d2: DateValue = { year: 2025, month: 5, day: 15 };
      expect(isSameDay(d1, d2)).toBe(true);
    });

    it('returns false when day differs', () => {
      const d1: DateValue = { year: 2025, month: 5, day: 15 };
      const d2: DateValue = { year: 2025, month: 5, day: 16 };
      expect(isSameDay(d1, d2)).toBe(false);
    });

    it('returns false when month differs', () => {
      const d1: DateValue = { year: 2025, month: 5, day: 15 };
      const d2: DateValue = { year: 2025, month: 6, day: 15 };
      expect(isSameDay(d1, d2)).toBe(false);
    });

    it('returns false when year differs', () => {
      const d1: DateValue = { year: 2025, month: 5, day: 15 };
      const d2: DateValue = { year: 2026, month: 5, day: 15 };
      expect(isSameDay(d1, d2)).toBe(false);
    });
  });

  describe('isDateBefore', () => {
    it('returns true when first date is earlier by year', () => {
      expect(
        isDateBefore(
          { year: 2024, month: 11, day: 31 },
          { year: 2025, month: 0, day: 1 },
        ),
      ).toBe(true);
    });

    it('returns true when first date is earlier by month', () => {
      expect(
        isDateBefore(
          { year: 2025, month: 0, day: 31 },
          { year: 2025, month: 1, day: 1 },
        ),
      ).toBe(true);
    });

    it('returns true when first date is earlier by day', () => {
      expect(
        isDateBefore(
          { year: 2025, month: 5, day: 14 },
          { year: 2025, month: 5, day: 15 },
        ),
      ).toBe(true);
    });

    it('returns false for the same date', () => {
      const d: DateValue = { year: 2025, month: 5, day: 15 };
      expect(isDateBefore(d, d)).toBe(false);
    });
  });

  describe('isDateAfter', () => {
    it('returns true when first date is later', () => {
      expect(
        isDateAfter(
          { year: 2025, month: 5, day: 16 },
          { year: 2025, month: 5, day: 15 },
        ),
      ).toBe(true);
    });

    it('returns false for the same date', () => {
      const d: DateValue = { year: 2025, month: 5, day: 15 };
      expect(isDateAfter(d, d)).toBe(false);
    });
  });

  describe('isDateInRange', () => {
    const start: DateValue = { year: 2025, month: 0, day: 10 };
    const end: DateValue = { year: 2025, month: 0, day: 20 };

    it('returns true for a date within the range', () => {
      expect(isDateInRange({ year: 2025, month: 0, day: 15 }, start, end)).toBe(true);
    });

    it('returns true for the start boundary', () => {
      expect(isDateInRange(start, start, end)).toBe(true);
    });

    it('returns true for the end boundary', () => {
      expect(isDateInRange(end, start, end)).toBe(true);
    });

    it('returns false for a date before the range', () => {
      expect(isDateInRange({ year: 2025, month: 0, day: 9 }, start, end)).toBe(false);
    });

    it('returns false for a date after the range', () => {
      expect(isDateInRange({ year: 2025, month: 0, day: 21 }, start, end)).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('returns 31 for January', () => {
      expect(getDaysInMonth(2025, 0)).toBe(31);
    });

    it('returns 28 for February in a non-leap year', () => {
      expect(getDaysInMonth(2025, 1)).toBe(28);
    });

    it('returns 29 for February in a leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('returns 30 for April', () => {
      expect(getDaysInMonth(2025, 3)).toBe(30);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('returns the correct day of week for a known date', () => {
      // January 1, 2025 is a Wednesday (3)
      expect(getFirstDayOfMonth(2025, 0)).toBe(3);
    });
  });

  describe('getCalendarDays', () => {
    it('returns an array with leading nulls for empty cells', () => {
      const days = getCalendarDays(2025, 0); // Jan 2025, starts on Wednesday
      const leadingNulls = days.filter((d, i) => d === null && i < 7).length;
      expect(leadingNulls).toBeGreaterThan(0);
    });

    it('contains all days of the month', () => {
      const days = getCalendarDays(2025, 0);
      const actualDays = days.filter((d) => d !== null);
      expect(actualDays).toHaveLength(31);
    });

    it('first non-null day has day=1', () => {
      const days = getCalendarDays(2025, 0);
      const firstDay = days.find((d) => d !== null);
      expect(firstDay?.day).toBe(1);
    });

    it('adjusts for Monday-first week', () => {
      const sundayFirst = getCalendarDays(2025, 0, 0);
      const mondayFirst = getCalendarDays(2025, 0, 1);
      // Both should contain 31 actual days
      expect(sundayFirst.filter((d) => d !== null)).toHaveLength(31);
      expect(mondayFirst.filter((d) => d !== null)).toHaveLength(31);
    });
  });

  describe('formatDate', () => {
    const date: DateValue = { year: 2025, month: 0, day: 5 };

    it('formats as MM/DD/YYYY by default', () => {
      expect(formatDate(date)).toBe('01/05/2025');
    });

    it('formats as DD/MM/YYYY', () => {
      expect(formatDate(date, 'DD/MM/YYYY')).toBe('05/01/2025');
    });

    it('formats as YYYY-MM-DD', () => {
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2025-01-05');
    });
  });

  describe('parseDate', () => {
    it('parses MM/DD/YYYY format', () => {
      const result = parseDate('01/15/2025');
      expect(result).toEqual({ year: 2025, month: 0, day: 15 });
    });

    it('parses DD/MM/YYYY format', () => {
      const result = parseDate('15/01/2025', 'DD/MM/YYYY');
      expect(result).toEqual({ year: 2025, month: 0, day: 15 });
    });

    it('parses YYYY-MM-DD format', () => {
      const result = parseDate('2025-01-15', 'YYYY-MM-DD');
      expect(result).toEqual({ year: 2025, month: 0, day: 15 });
    });

    it('returns null for invalid format', () => {
      expect(parseDate('not-a-date')).toBeNull();
    });

    it('returns null for invalid month', () => {
      expect(parseDate('13/01/2025')).toBeNull();
    });

    it('returns null for invalid day', () => {
      expect(parseDate('02/30/2025')).toBeNull();
    });

    it('returns null for incomplete input', () => {
      expect(parseDate('01/15')).toBeNull();
    });
  });

  describe('addMonths', () => {
    it('adds months within the same year', () => {
      const result = addMonths({ year: 2025, month: 0, day: 15 }, 3);
      expect(result).toEqual({ year: 2025, month: 3, day: 15 });
    });

    it('rolls over to the next year', () => {
      const result = addMonths({ year: 2025, month: 10, day: 15 }, 3);
      expect(result).toEqual({ year: 2026, month: 1, day: 15 });
    });

    it('subtracts months', () => {
      const result = addMonths({ year: 2025, month: 2, day: 15 }, -3);
      expect(result).toEqual({ year: 2024, month: 11, day: 15 });
    });

    it('clamps day to max days in target month', () => {
      const result = addMonths({ year: 2025, month: 0, day: 31 }, 1);
      expect(result).toEqual({ year: 2025, month: 1, day: 28 });
    });
  });

  describe('addYears', () => {
    it('adds years', () => {
      const result = addYears({ year: 2025, month: 5, day: 15 }, 2);
      expect(result).toEqual({ year: 2027, month: 5, day: 15 });
    });

    it('subtracts years', () => {
      const result = addYears({ year: 2025, month: 5, day: 15 }, -1);
      expect(result).toEqual({ year: 2024, month: 5, day: 15 });
    });
  });

  describe('dateValueToDate / dateToDateValue', () => {
    it('converts DateValue to Date and back', () => {
      const original: DateValue = { year: 2025, month: 5, day: 15 };
      const date = dateValueToDate(original);
      const roundTrip = dateToDateValue(date);
      expect(roundTrip).toEqual(original);
    });

    it('converts a Date to DateValue correctly', () => {
      const date = new Date(2025, 11, 25);
      expect(dateToDateValue(date)).toEqual({ year: 2025, month: 11, day: 25 });
    });
  });
});
