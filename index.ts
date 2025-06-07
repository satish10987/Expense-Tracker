export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Expense = {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  notes?: string;
};

export interface ExpensesContextType {
  expenses: Expense[];
  categories: Category[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
}

export type TimeRange = 'day' | 'week' | 'month' | 'year' | 'custom';

export type ThemeMode = 'light' | 'dark';

export interface AppSettings {
  themeMode: ThemeMode;
  currency: string;
}