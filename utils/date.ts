/**
 * Date formatting utilities
 * Uses date-fns with Indonesian locale
 */

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return format(dateObj, 'd MMM yyyy', { locale: id });
  } catch (error) {
    return '-';
  }
};

export const formatDateShort = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return format(dateObj, 'd MMM', { locale: id });
  } catch (error) {
    return '-';
  }
};

export const formatDateFull = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return format(dateObj, 'EEEE, d MMMM yyyy', { locale: id });
  } catch (error) {
    return '-';
  }
};

export const formatRelativeDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (isNaN(dateObj.getTime())) return '-';
    return formatDistanceToNow(dateObj, { 
      addSuffix: true, 
      locale: id 
    });
  } catch (error) {
    return '-';
  }
};

export const formatDateForAPI = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getCurrentMonth = (): number => {
  return new Date().getMonth() + 1;
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};
