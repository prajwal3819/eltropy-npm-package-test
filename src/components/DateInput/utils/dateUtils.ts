export const getDaysOfWeek = (weekStartsOn: 0 | 1 = 0): string[] => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  if (weekStartsOn === 1) {
    return [...days.slice(1), days[0]];
  }
  return days;
};

export interface DateValue {
  year: number;
  month: number;
  day: number;
}

export const createDate = (year: number, month: number, day: number): Date => {
  return new Date(year, month, day);
};

export const getToday = (): DateValue => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
  };
};

export const isSameDay = (date1: DateValue, date2: DateValue): boolean => {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
};

export const isDateBefore = (date1: DateValue, date2: DateValue): boolean => {
  if (date1.year !== date2.year) return date1.year < date2.year;
  if (date1.month !== date2.month) return date1.month < date2.month;
  return date1.day < date2.day;
};

export const isDateAfter = (date1: DateValue, date2: DateValue): boolean => {
  if (date1.year !== date2.year) return date1.year > date2.year;
  if (date1.month !== date2.month) return date1.month > date2.month;
  return date1.day > date2.day;
};

export const isDateInRange = (
  date: DateValue,
  start: DateValue,
  end: DateValue,
): boolean => {
  return !isDateBefore(date, start) && !isDateAfter(date, end);
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getCalendarDays = (
  year: number,
  month: number,
  weekStartsOn: 0 | 1 = 0,
): (DateValue | null)[] => {
  const daysInMonth = getDaysInMonth(year, month);
  let firstDay = getFirstDayOfMonth(year, month);

  if (weekStartsOn === 1) {
    firstDay = firstDay === 0 ? 6 : firstDay - 1;
  }

  const days: (DateValue | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ year, month, day });
  }

  return days;
};

export const formatDate = (
  date: DateValue,
  format: string = 'MM/DD/YYYY',
): string => {
  const month = String(date.month + 1).padStart(2, '0');
  const day = String(date.day).padStart(2, '0');
  const year = String(date.year);

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('M', String(date.month + 1))
    .replace('D', String(date.day));
};

export const parseDate = (
  dateString: string,
  format: string = 'MM/DD/YYYY',
): DateValue | null => {
  try {
    const parts = dateString.split(/[\/\-\.]/);
    if (parts.length !== 3) return null;

    let month: number, day: number, year: number;

    if (format.startsWith('MM')) {
      month = parseInt(parts[0], 10) - 1;
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    } else if (format.startsWith('DD')) {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    } else {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    }

    if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
    if (month < 0 || month > 11) return null;
    if (day < 1 || day > getDaysInMonth(year, month)) return null;

    return { year, month, day };
  } catch {
    return null;
  }
};

export const addMonths = (date: DateValue, months: number): DateValue => {
  let newMonth = date.month + months;
  let newYear = date.year;

  while (newMonth > 11) {
    newMonth -= 12;
    newYear++;
  }
  while (newMonth < 0) {
    newMonth += 12;
    newYear--;
  }

  const maxDay = getDaysInMonth(newYear, newMonth);
  const newDay = Math.min(date.day, maxDay);

  return { year: newYear, month: newMonth, day: newDay };
};

export const addYears = (date: DateValue, years: number): DateValue => {
  return { ...date, year: date.year + years };
};

export const dateValueToDate = (dateValue: DateValue): Date => {
  return new Date(dateValue.year, dateValue.month, dateValue.day);
};

export const dateToDateValue = (date: Date): DateValue => {
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    day: date.getDate(),
  };
};
