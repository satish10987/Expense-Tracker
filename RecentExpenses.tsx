import React from 'react';
import { formatDate, formatAmount } from '../../utils/dateUtils';
import { useExpenses } from '../../context/ExpensesContext';
import { useSettings } from '../../context/SettingsContext';
import { getCategoryById } from '../../utils/formatters';
import { Calendar, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const RecentExpenses: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const { settings } = useSettings();
  
  // Sort expenses by date (newest first) and take the 5 most recent
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Expenses</h2>
        <Link 
          to="/expenses" 
          className="text-primary-500 hover:text-primary-600 text-sm font-medium"
        >
          View All
        </Link>
      </div>
      
      {recentExpenses.length > 0 ? (
        <div className="space-y-4">
          {recentExpenses.map((expense) => {
            const category = getCategoryById(categories, expense.categoryId);
            
            return (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3" 
                    style={{ backgroundColor: category?.color + '33' }} // Adding transparency
                  >
                    <span 
                      className="text-xl font-semibold" 
                      style={{ color: category?.color }}
                    >
                      {formatAmount(expense.amount, settings.currency).charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{expense.description}</p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar size={12} className="mr-1" />
                      <span className="mr-3">{formatDate(expense.date)}</span>
                      {category && (
                        <>
                          <Tag size={12} className="mr-1" />
                          <span>{category.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <span className="font-semibold text-gray-800 dark:text-white">
                  {formatAmount(expense.amount, settings.currency)}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No expenses recorded yet.</p>
          <Link 
            to="/expenses/add" 
            className="mt-2 inline-block text-primary-500 hover:text-primary-600 font-medium"
          >
            Add your first expense
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentExpenses;