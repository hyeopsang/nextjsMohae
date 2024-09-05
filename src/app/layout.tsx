import "./globals.css";
import { ThemeProvider } from './utils/themeContext';
import AuthProvider from "./utils/authProvider";
import Sidebar from "./components/Sidebar";
import React from "react";
import { Metadata } from 'next';
import Providers from "./utils/Providers";


export const metadata: Metadata = {
  title: "Mohae",
  description: "Community",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
      <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          />
      </head>
      <body className="w-screen h-screen flex">
        <AuthProvider>
          <ThemeProvider>
            <div className="w-fit h-full fixed top-0 left-0 z-50">
              <Sidebar />
            </div>
            <main className="w-screen h-screen flex">
              <Providers>
                {children}
              </Providers>
            </main>
          </ThemeProvider>  
        </AuthProvider>
      </body>
    </html>
  );
}
