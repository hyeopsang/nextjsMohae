'use client'

import { useQuery } from '@tanstack/react-query';
import React, { useState, useMemo } from 'react';
import Post from './Post';
import Search from './Search';
import getPosts from '../posts/getPost';

interface PostData {
  id: number;
  text: string;
  tags: string[];
  email: string;
}

const PostList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { data, error, isLoading } = useQuery<PostData[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  const filteredPosts = useMemo(() => {
    if (!data) return []
    const lowercasedQuery = searchQuery.toLowerCase()
    return data.filter(post =>
      post.text.toLowerCase().includes(lowercasedQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)) ||
      post.email.toLowerCase().includes(lowercasedQuery)
    )
  }, [searchQuery, data])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>An error occurred</p>

  return (
    <div>
      <Search onSearch={setSearchQuery} />
      <div className="w-[35%] h-fit overflow-hidden bg-transparent rounded-t-[25px] mx-auto border-2 border-black/15 z-50 text-black">
        <div className="bg-white/10 w-full h-fit">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Post key={post.id} e={post} />
            ))
          ) : (
            <p className='p-[15px]'>게시물이 없어요 ㅠㅠ</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PostList
