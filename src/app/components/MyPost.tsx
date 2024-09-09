"use client";
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserPost from './UserPost';
import UserInfo from './UserInfo';
import { redirect } from 'next/navigation';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface PostData {
  user_id: number;
  id: number;
  title: string;
  content: string;
  user_nickname: string;
}

const fetchPosts = async (email: string) => {
  if (!email) return [];
  const response = await axios.get(`/api/posts?email=${encodeURIComponent(email)}`);
  return response.data;
};

const MyPost: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const email = session?.user?.user_nickname ?? '';
  useEffect(() => {
    const alertMessage = async () => {
      if (!session) {
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
        } else {
          router.push('/');
        }
      }
    };

    alertMessage();
  }, [session, router]);
  
  const { data: myPosts, isLoading, error } = useQuery({
    queryKey: ['myPosts', email],
    queryFn: () => fetchPosts(email),
    enabled: !!email,
  });

  return (
    <div>
      <UserInfo />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error fetching posts</p>
      ) : myPosts && myPosts.length > 0 ? (
        myPosts.map((post: PostData) => (
          <UserPost key={post.id} e={post} />
        ))
      ) : (
        <p>게시물이 없어요ㅠㅠ</p>
      )}
    </div>
  );
};

export default MyPost;
