"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";
import Image from "next/image";

const LoginPage: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div className="w-full flex justify-center items-center bg-white">
            {session ? (
                <button 
                    className="w-[100px] h-[fit] text-black text-[16px] font-[500] bg-white" 
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <Image width={100} height={100} src="/googlelogo.png" alt="Google Logo" priority/>
                    <p className="py-[10px]">로그아웃</p>
                </button>
            ) : (
                <button 
                    className="w-[100px] h-[fit] text-black text-[16px] font-[500] bg-white" 
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                    <Image width={100} height={100} src="/googlelogo.png" alt="Google Logo" priority/>
                    <p className="py-[10px]">구글 로그인</p>
                </button>
            )}
        </div>
    );
};

export default LoginPage;
