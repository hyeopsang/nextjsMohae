'use client';
import { SessionProvider, useSession } from "next-auth/react";
import React, { ReactNode } from "react"; 

interface AuthProviderProps {
  children: ReactNode;
}

const authProvider:React.FC<AuthProviderProps> = ({children}) => {

  return (
    <SessionProvider>
        {children}
    </SessionProvider>        
  )
}
export default authProvider;
 
