"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import AddPost from './components/AddPost';

interface MyContextType {
  addPost: boolean;
  setAddPost: React.Dispatch<React.SetStateAction<boolean>>;
  onChangeAddPost: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<MyContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [addPost, setAddPost] = useState<boolean>(false);

  const onChangeAddPost = () => {
    setAddPost(!addPost);
  };

  return (
    <ThemeContext.Provider value={{ addPost, setAddPost, onChangeAddPost }}>
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
