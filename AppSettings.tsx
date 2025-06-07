import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Moon, Sun, DollarSign, Save } from 'lucide-react';

const AppSettings: React.FC = () => {
  const { settings, updateTheme, updateCurrency } = useSettings();
  const [currency, setCurrency] = useState(settings.currency);
  
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };
  
  const handleSave = () => {
    updateCurrency(currency);
    alert('Settings saved successfully!');
  };
  
  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' },
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'CNY', name: 'Chinese Yuan (¥)' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Settings
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Appearance
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => updateTheme('light')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    settings.themeMode === 'light'
                      ? 'border-primary-500 bg-primary-50 dark:bg-gray-700'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Sun size={24} className="text-yellow-500 mb-2" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white">Light</span>
                </button>
                
                <button
                  onClick={() => updateTheme('dark')}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    settings.themeMode === 'dark'
                      ? 'border-primary-500 bg-primary-50 dark:bg-gray-700'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Moon size={24} className="text-accent-500 mb-2" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white">Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Regional Settings
          </h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400" />
                </div>
                <select
                  id="currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  className="input pl-10"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This will be used to format all amounts in the app.
              </p>
            </div>
            
            <button
              onClick={handleSave}
              className="btn btn-primary flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Settings
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          About MoneyTrack
        </h2>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          MoneyTrack is a personal expense tracker that helps you manage your finances with ease.
          Track your daily expenses, categorize them, and visualize your spending habits with 
          beautiful charts and reports.
        </p>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Version 0.1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;