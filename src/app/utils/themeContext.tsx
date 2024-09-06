"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface MyContextType {
  addPost: boolean;
  setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeAddPost: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}
const queryClient = new QueryClient()

const ThemeContext = createContext<MyContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [addPost, setAddPost] = useState<boolean>(false);

  const onChangeAddPost = () => {
    setAddPost(!addPost);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext.Provider value={{ addPost, setAddPost, onChangeAddPost }}>
        {children}
      </ThemeContext.Provider>
    </QueryClientProvider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
