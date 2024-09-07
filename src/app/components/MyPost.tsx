"use client";
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserPost from './UserPost';
import UserInfo from './UserInfo';

interface PostData {
  id: number;
  text: string;
  tags: string[];
  email: string;
}

const fetchPosts = async (email: string) => {
  if (!email) return [];
  const response = await axios.get(`/api/posts?email=${encodeURIComponent(email)}`);
  return response.data;
};

const MyPost: React.FC = () => {
  const { data: session } = useSession();
  const email = session?.user?.email ?? '';

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
        <p>No posts available</p>
      )}
    </div>
  );
};

export default MyPost;
