import {
  startOfDay,
  differenceInDays,
  isSameDay,
  subDays,
  format,
  isToday,
  isYesterday,
} from 'date-fns';
import { es } from 'date-fns/locale';

export {
  startOfDay,
  differenceInDays,
  isSameDay,
  subDays,
  format,
  isToday,
  isYesterday,
};

/**
 * Formatea una fecha de forma amigable en español
 */
export function formatFriendlyDate(date: Date): string {
  if (isToday(date)) {
    return 'Hoy';
  }
  if (isYesterday(date)) {
    return 'Ayer';
  }
  return format(date, 'dd/MM/yyyy', { locale: es });
}

/**
 * Calcula los días entre dos fechas
 */
export function daysBetween(date1: Date, date2: Date): number {
  return Math.abs(differenceInDays(startOfDay(date1), startOfDay(date2)));
}

/**
 * Verifica si una fecha es del día actual
 */
export function isDateToday(date: Date | null): boolean {
  if (!date) return false;
  return isSameDay(startOfDay(date), startOfDay(new Date()));
}
