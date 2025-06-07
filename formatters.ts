import { Expense, Category } from '../types';

export const calculateTotalExpenses = (expenses: any[]): number => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const formatAmount = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

interface CategoryTotal {
  category: Category;
  total: number;
  percentage: number;
}

export const getCategoryById = (categories: Category[], categoryId: string): Category | undefined => {
  return categories.find(category => category.id === categoryId);
};

export const groupExpensesByCategory = (expenses: Expense[], categories: Category[]): CategoryTotal[] => {
  const totalExpenses = calculateTotalExpenses(expenses);
  
  // Create a map of category totals
  const categoryTotals = new Map<string, number>();
  categories.forEach(category => categoryTotals.set(category.id, 0));
  
  // Sum expenses by category
  expenses.forEach(expense => {
    const currentTotal = categoryTotals.get(expense.categoryId) || 0;
    categoryTotals.set(expense.categoryId, currentTotal + expense.amount);
  });
  
  // Convert to array of category totals with percentages
  return categories.map(category => {
    const total = categoryTotals.get(category.id) || 0;
    const percentage = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
    
    return {
      category,
      total,
      percentage: Number(percentage.toFixed(1))
    };
  }).sort((a, b) => b.total - a.total); // Sort by total amount descending
};