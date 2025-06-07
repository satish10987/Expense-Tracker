import { Category } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const defaultCategories: Category[] = [
  {
    id: uuidv4(),
    name: 'Food & Dining',
    color: '#0D9488', // Primary color
    icon: 'utensils',
  },
  {
    id: uuidv4(),
    name: 'Transportation',
    color: '#8B5CF6', // Accent color
    icon: 'car',
  },
  {
    id: uuidv4(),
    name: 'Shopping',
    color: '#F59E0B', // Warning color
    icon: 'shopping-bag',
  },
  {
    id: uuidv4(),
    name: 'Entertainment',
    color: '#EC4899', // Pink
    icon: 'film',
  },
  {
    id: uuidv4(),
    name: 'Housing',
    color: '#3B82F6', // Blue
    icon: 'home',
  },
  {
    id: uuidv4(),
    name: 'Utilities',
    color: '#10B981', // Success color
    icon: 'plug',
  },
  {
    id: uuidv4(),
    name: 'Healthcare',
    color: '#EF4444', // Error color
    icon: 'heart',
  },
  {
    id: uuidv4(),
    name: 'Other',
    color: '#6B7280', // Gray
    icon: 'more-horizontal',
  },
];