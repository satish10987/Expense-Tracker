import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, isWithinInterval } from 'date-fns';
import { TimeRange } from '../types';

export const formatDate = (date: string): string => {
  return format(new Date(date), 'MMM d, yyyy');
};

export const formatAmount = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const getDateRangeFromType = (rangeType: TimeRange, customStartDate?: Date, customEndDate?: Date) => {
  const today = new Date();
  
  if (rangeType === 'custom' && customStartDate && customEndDate) {
    return {
      start: startOfDay(customStartDate),
      end: endOfDay(customEndDate),
    };
  }
  
  switch (rangeType) {
    case 'day':
      return {
        start: startOfDay(today),
        end: endOfDay(today),
      };
    case 'week':
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      };
    case 'month':
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
    case 'year':
      return {
        start: startOfYear(today),
        end: endOfYear(today),
      };
    default:
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
      };
  }
};

export const isExpenseInRange = (expenseDate: string, range: { start: Date; end: Date }) => {
  const date = new Date(expenseDate);
  return isWithinInterval(date, range);
};

export const getCurrentMonthName = (): string => {
  return format(new Date(), 'MMMM yyyy');
};