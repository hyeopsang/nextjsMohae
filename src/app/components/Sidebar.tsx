'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from '../themeContext'; // ThemeContext 사용
import React from "react";
import { signOut } from "next-auth/react"


const Sidebar:React.FC = () => {
  const pathname = usePathname();
  const { addPost, onChangeAddPost } = useTheme(); 
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    const baseContainer = "w-fit h-[52px] rounded-[12px] overflow-hidden cursor-pointer relative group-hover:justify-between flex justify-center items-center";
    const activeContainer = `${baseContainer} hover:bg-white/15 text-white`;
    const inactiveContainer = `${baseContainer} hover:bg-white/15`;

    const container = isActive ? activeContainer : inactiveContainer;

    const iconClass = isActive ? "material-symbols-outlined px-[11px] text-[32px] text-white" : "material-symbols-outlined px-[11px] text-[32px] text-white/30";
    const fontVariation = isActive ? "'FILL' 1" : "'FILL' 0";

    return {
      container,
      iconClass,
      fontVariation
    };
  };

  return (
    <div className={`w-fit h-full pt-[8px] pb-[20px] px-[12px] border-r group bg-black border-white/15 flex flex-col justify-center`}>
      <div className="w-fit grow space-y-[10px] text-[16px] font-[800] flex flex-col justify-center">
        <Link href="/">
          <div className={getLinkStyle('/').container}>
            <span className={getLinkStyle('/').iconClass} style={{ fontVariationSettings: getLinkStyle('/').fontVariation }}>
              home
            </span>
            <p className={`text-white hidden group-hover:block group-hover:w-[100px] text-center`}>home</p>
          </div>
        </Link>
        <div className={`w-fit group-hover:justify-between h-[52px] rounded-[12px] flex justify-center items-center overflow-hidden group bg-white/15 transition-all duration-[300ms] cursor-pointer relative`}
            onClick={()=> onChangeAddPost()}
        >
            <p 
                className={`material-symbols-outlined px-[11px] text-white
                            ${addPost === true ? 'rotate-45 transition duration-[300ms]' : 'transition duration-[300ms]'}
                            `} 
                style={{ fontVariationSettings: "'FILL' 0"}}
                >

                add
            </p>
            <p className={`text-white hidden group-hover:block group-hover:w-[100px] text-center`}>
                {addPost === false 
                    ? 'post'
                    : 'return'
                }
                </p>
        </div>
        <Link href="/myprofile">
          <div className={getLinkStyle('/myprofile').container}>
            <span className={getLinkStyle('/myprofile').iconClass} style={{ fontVariationSettings: getLinkStyle('/profile').fontVariation }}>
              person
            </span>
            <p className={`text-white hidden group-hover:block group-hover:w-[100px] text-center`}>profile</p>
          </div>
        </Link>
      </div>
      <button 
          className="w-full h-fit flex justify-center items-center text-white py-[10px] hover:bg-white/15 rounded-[12px]" 
          onClick={() => signOut({ callbackUrl: "/" })}
          >
          <span className="material-symbols-outlined">
          logout
          </span>
        </button>
    </div>
  );
}
export default Sidebar
