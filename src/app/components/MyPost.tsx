"use client";
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserPost from './UserPost';
import UserInfo from './UserInfo';
import { redirect } from 'next/navigation';
interface PostData {
  id: number
  text: string;
  tags: string[];
  email: string;
}

const MyPost: React.FC = () => {
  const { data: session, status } = useSession();
  const [myPosts, setMyPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  if (!session) {
    redirect('/login'); 
  }

  const Email = session?.user?.email ?? '';

  useEffect(() => {
    const fetchPosts = async () => {
      if (!Email) return; 
      
      setLoading(true); 
      setError(null); 
      
      try {
        const response = await axios.get(`/api/posts?email=${encodeURIComponent(Email)}`);
        setMyPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError('Failed to fetch posts'); // 에러 상태 업데이트
      } finally {
        setLoading(false); 
      }
    };

    fetchPosts();
  }, [Email]);

  return (
    <div>
      <UserInfo/>
      {loading ? (
        <p>Loading...</p> 
      ) : error ? (
        <p>{error}</p>
      ) : myPosts.length > 0 ? (
        myPosts.map((post, index) => (
          <UserPost key={index} e={post} />
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default MyPost;


