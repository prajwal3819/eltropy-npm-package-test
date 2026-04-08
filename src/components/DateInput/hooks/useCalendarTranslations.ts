import { useMemo } from 'react';

export type Locale = 'en' | 'es';

export interface CalendarTranslations {
  months: string[];
  monthsShort: string[];
  daysOfWeek: string[];
  daysOfWeekShort: string[];
  weekStartsOn: 0 | 1;
  cancel: string;
  save: string;
  done: string;
}

const translations: Record<Locale, CalendarTranslations> = {
  en: {
    months: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthsShort: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    daysOfWeek: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    daysOfWeekShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    weekStartsOn: 0,
    cancel: 'Cancel',
    save: 'Save',
    done: 'Done',
  },
  es: {
    months: [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ],
    monthsShort: [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ],
    daysOfWeek: [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ],
    daysOfWeekShort: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    weekStartsOn: 1,
    cancel: 'Cancelar',
    save: 'Guardar',
    done: 'Hecho',
  },
};

export const useCalendarTranslations = (
  locale: Locale = 'en',
): CalendarTranslations => {
  return useMemo(() => translations[locale] || translations.en, [locale]);
};
