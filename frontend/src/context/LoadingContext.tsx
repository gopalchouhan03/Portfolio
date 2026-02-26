'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoadingContextType {
  isFirstLoad: boolean;
  setIsFirstLoad: (value: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if this is the first load using sessionStorage
    const hasLoaded = sessionStorage.getItem('portfolio_has_loaded');
    
    if (hasLoaded) {
      setIsFirstLoad(false);
    } else {
      // Mark that the site has been loaded
      sessionStorage.setItem('portfolio_has_loaded', 'true');
      setIsFirstLoad(true);
    }
  }, []);

  return (
    <LoadingContext.Provider value={{ isFirstLoad, setIsFirstLoad }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
