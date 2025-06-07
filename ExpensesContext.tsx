import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Expense, Category, ExpensesContextType } from '../types';
import { defaultCategories } from '../data/defaultCategories';

// Create the context
const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

// Provider component
export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    const storedCategories = localStorage.getItem('categories');
    
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Initialize with default categories if none exist
      setCategories(defaultCategories);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);
  
  // Expense operations
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: uuidv4() };
    setExpenses(prevExpenses => [...prevExpenses, newExpense]);
  };
  
  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(prevExpenses => 
      prevExpenses.map(expense => 
        expense.id === updatedExpense.id ? updatedExpense : expense
      )
    );
  };
  
  const deleteExpense = (id: string) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
  };
  
  // Category operations
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: uuidv4() };
    setCategories(prevCategories => [...prevCategories, newCategory]);
  };
  
  const updateCategory = (updatedCategory: Category) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };
  
  const deleteCategory = (id: string) => {
    // Check if any expenses use this category
    const expensesWithCategory = expenses.filter(expense => expense.categoryId === id);
    
    if (expensesWithCategory.length > 0) {
      alert(`Cannot delete this category as it's used by ${expensesWithCategory.length} expenses.`);
      return;
    }
    
    setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
  };
  
  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        categories,
        addExpense,
        updateExpense,
        deleteExpense,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

// Custom hook to use the context
export const useExpenses = (): ExpensesContextType => {
  const context = useContext(ExpensesContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};