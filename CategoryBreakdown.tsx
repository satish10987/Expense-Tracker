import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useExpenses } from '../../context/ExpensesContext';
import { useSettings } from '../../context/SettingsContext';
import { formatAmount } from '../../utils/dateUtils';
import { groupExpensesByCategory, calculateTotalExpenses } from '../../utils/formatters';
import { getDateRangeFromType, isExpenseInRange } from '../../utils/dateUtils';
import { PieChart } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryBreakdown: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const { settings } = useSettings();
  
  // Get current month range
  const currentMonthRange = getDateRangeFromType('month');
  
  // Filter expenses for current month
  const currentMonthExpenses = expenses.filter(expense => 
    isExpenseInRange(expense.date, currentMonthRange)
  );
  
  // Group expenses by category
  const expensesByCategory = groupExpensesByCategory(currentMonthExpenses, categories);
  
  // Prepare data for the chart
  const categoryLabels = Object.values(expensesByCategory).map(item => item.category.name);
  const categoryData = Object.values(expensesByCategory).map(item => item.total);
  const categoryColors = Object.values(expensesByCategory).map(item => item.category.color);
  
  const chartData = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryData,
        backgroundColor: categoryColors,
        borderColor: Array(categoryLabels.length).fill('#FFFFFF'),
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${context.label}: ${formatAmount(value, settings.currency)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '65%',
  };
  
  const totalAmount = calculateTotalExpenses(currentMonthExpenses);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Category Breakdown</h2>
        <div className="flex items-center text-gray-500 dark:text-gray-400">
          <PieChart size={18} className="mr-2" />
          <span>This Month</span>
        </div>
      </div>
      
      {currentMonthExpenses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 h-64 relative">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {formatAmount(totalAmount, settings.currency)}
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {Object.values(expensesByCategory).map((item) => {
                const percentage = totalAmount > 0 
                  ? Math.round((item.total / totalAmount) * 100) 
                  : 0;
                
                return (
                  <div key={item.category.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: item.category.color }}
                      />
                      <span className="text-sm text-gray-800 dark:text-white">
                        {item.category.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-800 dark:text-white mr-2">
                        {formatAmount(item.total, settings.currency)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No expenses recorded this month.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;