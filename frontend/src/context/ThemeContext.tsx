'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getInitialTheme(): Theme {
  // This function gets the theme that was already applied by the script in layout
  if (typeof window === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
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

  // Apply theme on initial load and sync with stored preference
  useEffect(() => {
    // Get theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else if (!savedTheme) {
      // Check system preference only if no saved theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme: Theme = prefersDark ? 'dark' : 'light';
      if (initialTheme !== theme) {
        setTheme(initialTheme);
        applyTheme(initialTheme);
      }
    }
    
    setMounted(true);
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted, applyTheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Don't render children until mounted to prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

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
