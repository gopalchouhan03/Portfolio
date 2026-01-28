'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  // Define applyTheme first so it can be used in useEffect hooks
  const applyTheme = useCallback((newTheme: Theme) => {
    const htmlElement = document.documentElement;
    if (newTheme === 'dark') {
      htmlElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      htmlElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, []);

  // Apply theme on initial load
  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      applyTheme(savedTheme);
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme: Theme = prefersDark ? 'dark' : 'light';
      applyTheme(initialTheme);
      setTheme(initialTheme);
    }
    
    setMounted(true);
  }, [applyTheme]);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme, applyTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
