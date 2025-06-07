import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeMode, AppSettings } from '../types';

interface SettingsContextType {
  settings: AppSettings;
  updateTheme: (mode: ThemeMode) => void;
  updateCurrency: (currency: string) => void;
}

const defaultSettings: AppSettings = {
  themeMode: 'light',
  currency: 'USD',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedSettings = localStorage.getItem('app-settings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
    
    // Apply theme mode from settings
    const themeMode = storedSettings ? JSON.parse(storedSettings).themeMode : defaultSettings.themeMode;
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Apply theme mode when settings change
    if (settings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const updateTheme = (mode: ThemeMode) => {
    setSettings(prev => ({ ...prev, themeMode: mode }));
  };

  const updateCurrency = (currency: string) => {
    setSettings(prev => ({ ...prev, currency }));
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateTheme,
        updateCurrency,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};