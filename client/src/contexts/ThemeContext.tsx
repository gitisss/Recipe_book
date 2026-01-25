// client/src/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '../theme';
import { useTranslation } from 'react-i18next';
import type { ThemeMode } from '../theme';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = localStorage.getItem('themeMode') as ThemeMode;
    return savedMode || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const handleSetMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const { i18n } = useTranslation();
  const direction = i18n.dir();

  const theme = getTheme(mode, direction);

  return (
    <ThemeContext.Provider value={{ mode, setMode: handleSetMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

