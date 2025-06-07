import React from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { useExpenses } from '../../context/ExpensesContext';
import { useSettings } from '../../context/SettingsContext';
import { formatAmount } from '../../utils/dateUtils';
import { format, parseISO, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const YearlyChart: React.FC = () => {
  const { expenses } = useExpenses();
  const { settings } = useSettings();
  
  // Get current year start and end
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const yearEnd = endOfYear(new Date(currentYear, 0, 1));
  
  // Generate an array of all months in the year
  const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  
  // Create a map of monthly expenses
  const monthlyExpenses = monthsInYear.reduce((acc, month) => {
    const monthKey = format(month, 'yyyy-MM');
    acc[monthKey] = 0;
    return acc;
  }, {} as Record<string, number>);
  
  // Fill in the monthly expenses map
  expenses.forEach(expense => {
    const date = parseISO(expense.date);
    if (date.getFullYear() === currentYear) {
      const monthKey = format(date, 'yyyy-MM');
      if (monthlyExpenses[monthKey] !== undefined) {
        monthlyExpenses[monthKey] += expense.amount;
      }
    }
  });
  
  // Convert to arrays for the chart
  const labels = Object.keys(monthlyExpenses).map(key => format(parseISO(`${key}-01`), 'MMM'));
  const data = Object.values(monthlyExpenses);
  
  // Chart data
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Expenses',
        data,
        backgroundColor: '#0D9488',
        hoverBackgroundColor: '#0f766e',
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: `Months of ${currentYear}`,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount',
        },
        ticks: {
          callback: function(value: number) {
            return formatAmount(value, settings.currency, { maximumSignificantDigits: 3 });
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Expenses: ${formatAmount(context.parsed.y, settings.currency)}`;
          },
        },
      },
    },
  };
  
  // Calculate yearly total
  const yearlyTotal = data.reduce((sum, amount) => sum + amount, 0);
  
  // Calculate average per month
  const monthsWithExpenses = data.filter(amount => amount > 0).length;
  const monthlyAverage = monthsWithExpenses > 0 ? yearlyTotal / monthsWithExpenses : 0;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Yearly Overview ({currentYear})
      </h2>
      
      <div className="h-64 mb-6">
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total spent this year
          </p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {formatAmount(yearlyTotal, settings.currency)}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Average monthly spending
          </p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {formatAmount(monthlyAverage, settings.currency)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default YearlyChart;