"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AddPost from './components/AddPost';

interface MyContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  addPost: boolean;
  setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  toggleTheme: () => void;
  onChangeAddPost: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<MyContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [addPost, setAddPost] = useState<boolean>(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const onChangeAddPost = () => {
    setAddPost(!addPost);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, addPost, setAddPost, toggleTheme, onChangeAddPost }}>
      {children}
      {
        addPost === false
        ? ''
        : <div className='fixed w-screen h-screen flex justify-center items-center bg-white/70'><AddPost/></div>
      }
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
