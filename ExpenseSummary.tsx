import React from 'react';
import { useExpenses } from '../../context/ExpensesContext';
import { useSettings } from '../../context/SettingsContext';
import { calculateTotalExpenses, formatAmount } from '../../utils/formatters';
import { Wallet, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { getCurrentMonthName, getDateRangeFromType, isExpenseInRange } from '../../utils/dateUtils';

const ExpenseSummary: React.FC = () => {
  const { expenses } = useExpenses();
  const { settings } = useSettings();
  
  // Get current month's range
  const currentMonthRange = getDateRangeFromType('month');
  
  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(expense => 
    isExpenseInRange(expense.date, currentMonthRange)
  );
  
  // Calculate totals
  const totalCurrentMonth = calculateTotalExpenses(currentMonthExpenses);
  
  // Get previous month's range
  const today = new Date();
  const previousMonth = new Date(today.getFullYear(), today.getMonth() - 1);
  const previousMonthRange = {
    start: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), 1),
    end: new Date(today.getFullYear(), today.getMonth(), 0),
  };
  
  // Filter expenses for previous month
  const previousMonthExpenses = expenses.filter(expense => 
    isExpenseInRange(expense.date, previousMonthRange)
  );
  
  const totalPreviousMonth = calculateTotalExpenses(previousMonthExpenses);
  
  // Calculate month-over-month change
  let percentChange = 0;
  if (totalPreviousMonth > 0) {
    percentChange = ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100;
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Monthly Summary</h2>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <Calendar size={18} className="mr-2" />
          <span>{getCurrentMonthName()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900 mr-4">
            <Wallet size={24} className="text-primary-500 dark:text-primary-300" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {formatAmount(totalCurrentMonth, settings.currency)}
            </h3>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className={`p-3 rounded-full mr-4 ${
            percentChange > 0 
              ? 'bg-error-100 dark:bg-error-900' 
              : 'bg-success-100 dark:bg-success-900'
          }`}>
            {percentChange > 0 ? (
              <TrendingUp size={24} className="text-error-500 dark:text-error-300" />
            ) : (
              <TrendingDown size={24} className="text-success-500 dark:text-success-300" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Month over Month</p>
            <h3 className={`text-xl font-semibold ${
              percentChange > 0 
                ? 'text-error-600 dark:text-error-400' 
                : 'text-success-600 dark:text-success-400'
            }`}>
              {percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%
            </h3>
          </div>
        </div>
        
        <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="p-3 rounded-full bg-accent-100 dark:bg-accent-900 mr-4">
            <Calendar size={24} className="text-accent-500 dark:text-accent-300" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Month</p>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              {formatAmount(totalPreviousMonth, settings.currency)}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;