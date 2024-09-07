"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AddPost } from "../components/PostList";

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
        <div 
          className={`
            fixed inset-0 bg-black bg-opacity-70 
            flex justify-center items-center
            transition-opacity duration-300 ease-in-out
            ${addPost ? 'opacity-100 visible' : 'opacity-0 invisible'}
          `}
        >
          <div 
            className={`
              rounded-lg p-6 bg-transparent
              transform transition-all duration-300 ease-in-out
              ${addPost ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
            `}
          >
            {addPost && <AddPost />}
          </div>
        </div>
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
