import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { useExpenses } from '../../context/ExpensesContext';
import { useSettings } from '../../context/SettingsContext';
import { formatAmount } from '../../utils/dateUtils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyChart: React.FC = () => {
  const { expenses } = useExpenses();
  const { settings } = useSettings();
  const [monthOffset, setMonthOffset] = useState(0);
  
  // Get the selected month (current month + offset)
  const today = new Date();
  const selectedMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset);
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  
  // Generate an array of all days in the month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Filter expenses for the selected month
  const monthExpenses = expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return expenseDate >= monthStart && expenseDate <= monthEnd;
  });
  
  // Create a map of daily expenses
  const dailyExpenses = daysInMonth.reduce((acc, day) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    acc[dayKey] = 0;
    return acc;
  }, {} as Record<string, number>);
  
  // Fill in the daily expenses map
  monthExpenses.forEach(expense => {
    const dayKey = expense.date.substring(0, 10); // Extract YYYY-MM-DD part
    if (dailyExpenses[dayKey] !== undefined) {
      dailyExpenses[dayKey] += expense.amount;
    }
  });
  
  // Calculate cumulative expenses
  const labels = Object.keys(dailyExpenses).sort();
  const data = labels.map(day => dailyExpenses[day]);
  
  let cumulativeData = [];
  let runningTotal = 0;
  for (let amount of data) {
    runningTotal += amount;
    cumulativeData.push(runningTotal);
  }
  
  // Format labels for display (just day of month)
  const displayLabels = labels.map(day => format(parseISO(day), 'd'));
  
  // Chart data
  const chartData = {
    labels: displayLabels,
    datasets: [
      {
        label: 'Daily Expenses',
        data,
        borderColor: '#0D9488',
        backgroundColor: '#0D948833',
        tension: 0.3,
        pointRadius: 3,
        pointBackgroundColor: '#0D9488',
      },
      {
        label: 'Cumulative Expenses',
        data: cumulativeData,
        borderColor: '#8B5CF6',
        backgroundColor: '#8B5CF633',
        borderDash: [5, 5],
        tension: 0.3,
        pointRadius: 0,
        yAxisID: 'y1',
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
          text: 'Day of Month',
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Daily Amount',
        },
        ticks: {
          callback: function(value: number) {
            return formatAmount(value, settings.currency, { maximumSignificantDigits: 3 });
          },
        },
      },
      y1: {
        position: 'right' as const,
        title: {
          display: true,
          text: 'Cumulative Amount',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: number) {
            return formatAmount(value, settings.currency, { maximumSignificantDigits: 3 });
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${formatAmount(context.parsed.y, settings.currency)}`;
          },
        },
      },
    },
  };
  
  // Get total for the month
  const totalForMonth = Object.values(dailyExpenses).reduce((sum, amount) => sum + amount, 0);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Monthly Spending Trends
        </h2>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMonthOffset(monthOffset - 1)}
            className="btn btn-secondary px-3 py-1"
          >
            &lt; Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            {format(selectedMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setMonthOffset(monthOffset + 1)}
            disabled={monthOffset >= 0}
            className="btn btn-secondary px-3 py-1 disabled:opacity-50"
          >
            Next &gt;
          </button>
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <Line data={chartData} options={chartOptions} />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total spent in {format(selectedMonth, 'MMMM')}
        </p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {formatAmount(totalForMonth, settings.currency)}
        </p>
      </div>
    </div>
  );
};

export default MonthlyChart;