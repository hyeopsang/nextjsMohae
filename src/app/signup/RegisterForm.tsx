"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const RegisterForm: React.FC = () => {
  const [user_id, setUserId] = useState('');
  const [user_password, setUserPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user_nickname, setUserNickname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (user_password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }
    if (user_password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/userdata', {
        user_id,
        user_password,
        user_nickname
      });

      if (response.status === 200) {
        console.log("Registration successful");
        router.push('/login');
      } else {
        setError('회원가입에 실패했습니다.');
        console.error("Registration failed:", response.data);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full h-full flex justify-center items-center'>
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
        <div>
          <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900">비밀번호 확인</label>
          <input
            type="password"
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div>
          <label htmlFor="user_nickname" className="block mb-2 text-sm font-medium text-gray-900">닉네임</label>
          <input
            type="text"
            id="user_nickname"
            value={user_nickname}
            onChange={(e) => setUserNickname(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button 
          type="submit" 
          className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center"
          disabled={isLoading}
        >
          {isLoading ? '처리 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
