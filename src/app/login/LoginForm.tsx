"use client";
import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

function LoginForm() {
  const { data: session, status } = useSession();
  const [user_id, setUserId] = useState('');
  const [user_password, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
  
    try {
      const result = await signIn("credentials", {
        user_id: user_id,
        user_password: user_password,
        redirect: false,
        callbackUrl: '/'
      });
    
      if (result?.error) {
        setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        console.error("Login error:", result.error);
      } else if (result?.ok) {
        console.log("Login successful");
        router.push(result.url || '/');
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
        console.error("Unexpected result:", result);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === "authenticated") {
    return (
      <div className='w-full h-full flex flex-col justify-center items-center'>
        <p className="mb-4">안녕하세요, {session?.user?.user_nickname}님!</p>
        <button 
          onClick={handleLogout}
          className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full max-w-md px-5 py-2.5 text-center"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col justify-center items-center'>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <div>
          <label htmlFor="user_id" className="block mb-2 text-sm font-medium text-gray-900">아이디</label>
          <input
            type="text"
            id="user_id"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label htmlFor="user_password" className="block mb-2 text-sm font-medium text-gray-900">비밀번호</label>
          <input
            type="password"
            id="user_password"
            value={user_password}
            onChange={(e) => setUserPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button 
          type="submit" 
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          disabled={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <button
        className="max-w-md mt-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
        onClick={() => router.push('/signup')}>회원가입</button>  
    </div>
  );
}

export default LoginForm;
