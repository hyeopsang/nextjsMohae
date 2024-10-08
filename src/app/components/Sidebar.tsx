'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from '../utils/themeContext'; 
import React from "react";
import { signOut, signIn } from "next-auth/react"
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const Sidebar:React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { addPost, onChangeAddPost } = useTheme(); 
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path;
    const baseContainer = "w-fit h-[52px] rounded-[12px] overflow-hidden cursor-pointer relative group-hover:justify-between flex justify-center items-center";
    const activeContainer = `${baseContainer} hover:bg-black/15 text-black transition duration-200`;
    const inactiveContainer = `${baseContainer} hover:bg-black/15 transition duration-200`;

    const container = isActive ? activeContainer : inactiveContainer;

    const iconClass = isActive ? "material-symbols-outlined px-[11px] text-[32px] text-black" : "material-symbols-outlined px-[11px] text-[32px] text-black/30";
    const fontVariation = isActive ? "'FILL' 1" : "'FILL' 0";

    return {
      container,
      iconClass,
      fontVariation
    };
  };
  const handleClick = async (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      const result = await Swal.fire({
        title: '로그인이 필요해요!',
        text: '로그인 페이지로 이동하시겠습니까?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '로그인하기',
        cancelButtonText: '취소'
      });

      if (result.isConfirmed) {
        router.push('/login');
      }
    }
  };
  return (
    <div className={`w-fit h-full pt-[8px] pb-[20px] px-[12px] group bg-white flex flex-col justify-center`}>
      <div className="w-fit grow space-y-[10px] text-[16px] font-[800] flex flex-col justify-center">
        <Link href={"/"}>
          <div className={getLinkStyle('/').container}>
            <span className={getLinkStyle('/').iconClass} style={{ fontVariationSettings: getLinkStyle('/').fontVariation }}>
              home
            </span>
            <p className={`text-black hidden group-hover:block group-hover:w-[100px] text-center`}>홈</p>
          </div>
        </Link>
        <div className={`w-fit group-hover:justify-between h-[52px] rounded-[12px] flex justify-center items-center overflow-hidden group bg-black/5 hover:bg-black/15 transition-all duration-[300ms] cursor-pointer relative`}
            onClick={()=> onChangeAddPost()}
        >
            <p 
                className={`material-symbols-outlined px-[11px] text-black
                            ${addPost === true ? 'rotate-45 transition duration-200' : 'transition duration-200'}
                            `} 
                style={{ fontVariationSettings: "'FILL' 0"}}
                >

                add
            </p>
            <p className={`text-black hidden group-hover:block group-hover:w-[100px] text-center`}>
                {
                addPost === false 
                    ? '글 쓰기'
                    : 'return'
                }
                </p>
        </div>
        <Link href="/myprofile" onClick={handleClick}>
          <div className={getLinkStyle('/myprofile').container}>
            <span 
              className={getLinkStyle('/myprofile').iconClass} 
              style={{ fontVariationSettings: getLinkStyle('/myprofile').fontVariation }}
            >
              person
            </span>
            <p className={`text-black hidden group-hover:block group-hover:w-[100px] text-center`}>
              프로필
            </p>
          </div>
        </Link>
      </div>
      <button 
        className="w-full h-[52px] flex justify-center items-center text-black py-[10px] hover:bg-black/15 transition duration-200 rounded-[12px] overflow-hidden" 
        onClick={() => {
          if (session) {
            signOut({ callbackUrl: "/" });
          } else {
            signIn(undefined, { callbackUrl: "/" });
          }
        }}
      >
        <p className="w-0 group-hover:w-fit overflow-hidden mr-[10px]">{session ? "Sign Out" : "Sign In"}</p>
          <span className="material-symbols-outlined">
          {session ? "logout" : "login"}
          </span>
        </button>
    </div>
  );
}
export default Sidebar
