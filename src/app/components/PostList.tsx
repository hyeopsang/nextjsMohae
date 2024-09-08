'use client'

import { useQuery, useQueryClient, useMutation, useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect, useRef } from 'react';
import Post from './Post';
import Search from './Search';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useTheme } from '../utils/themeContext';


interface AddPostProps {
  onPostAdded?: () => void; 
}

interface PostData {
    id: number;
    title: string;
    content: string;
    user_nickname: string;
    user_id: string;
}

export const AddPost: React.FC<AddPostProps> = () => {
  const { data: session } = useSession();
  const userId = session?.user?.email ?? '';
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');  // mainTxt를 content로 변경
  const [error, setError] = useState<string | null>(null);
  const { setAddPost } = useTheme();
  
  const queryClient = useQueryClient();
  const { refetch } = useQuery({ queryKey: ['posts'] });

  const mutation = useMutation<PostData, Error, Omit<PostData, 'id'>>({
    mutationFn: async (newPost) => {
      console.log('Sending data:', newPost);  // 전송되는 데이터 로깅
      const response = await axios.post<PostData>('/api/posts', newPost);
      console.log('Server response:', response.data);  // 서버 응답 로깅
      return response.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        refetch()
        setTitle('');
        setContent('');  // mainTxt를 content로 변경
        setAddPost(false);
    },
    onError: (error) => {
        console.error("Failed to submit post:", error);
        setError("Failed to submit post. Please try again.");
    }
  });
    
  const onSubmit = async (e: React.FormEvent) => {
      if(!session) {
        alert("로그인이 필요합니다!");
        return
      }
      e.preventDefault();
      try {
        mutation.mutate({ user_id: userId, title: title, content: content , user_nickname: "게스트"});  // mainTxt를 content로 변경
      } catch (error) {
        console.log(error);
      }
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
  }

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);  // mainTxt를 content로 변경, 함수 이름도 변경
  }

  return (
      <div className="w-[420px] h-fit p-[20px] border border-black/15 bg-[#222] rounded-[15px] flex flex-wrap items-end">
          <input 
              type="text"
              placeholder="제목을 입력해 주세요" 
              className="w-full bg-transparent p-2 rounded mb-2 text-white" 
              value={title} 
              onChange={handleChangeTitle}
          />
          <textarea 
              placeholder="내용을 작성해 주세요" 
              className="w-full h-[200px] bg-transparent p-2 rounded mb-2 text-white" 
              value={content}  // mainTxt를 content로 변경
              onChange={handleChangeContent}  // handleChangeTxt를 handleChangeContent로 변경
          />
          <div className="w-full flex justify-end">
          {mutation.isPending ? (
                  'Adding post...'
              ) : (
                  <>
                  {mutation.isError ? (
                      <div>An error occurred: {mutation.error.message}</div>
                  ) : null}

                  {mutation.isSuccess ? <div>Post added!</div> : null}
                  <form onSubmit={onSubmit}>
                  <button 
                      type="submit"
                      disabled={title.length === 0 || content.length === 0}  // mainTxt를 content로 변경
                      className={`mt-[15px] px-[15px] py-[5px] border rounded-[10px] ${title.length > 0 && content.length > 0 ? 'text-white cursor-pointer' : 'text-white/20'}`}
                  >
                      게시
                  </button>
              </form>
                  </>
              )}
              
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
  );
}



const fetchPosts = async ({ pageParam = 0 }) => {
  const limit = 5;
  const response = await axios.get(`/api/posts?limit=${limit}&offset=${pageParam * limit}`);
  return response.data;
};

const PostList: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 5 ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const filteredPosts = React.useMemo(() => {
    if (!data) return [];
    const lowercasedQuery = searchQuery.toLowerCase();
    return data.pages.flatMap(page => 
      page.filter((post: PostData) =>
        post.content.toLowerCase().includes(lowercasedQuery) ||
        post.title.toLowerCase().includes(lowercasedQuery) ||
        post.user_id.toLowerCase().includes(lowercasedQuery)
      )
    ).reverse();
  }, [searchQuery, data]);

  if (status === 'pending') return <p>Loading...</p>;
  if (status === 'error') return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <Search onSearch={setSearchQuery} />
      <div className="w-[35%] h-fit overflow-hidden bg-transparent rounded-t-[25px] mx-auto border-2 border-black/15 z-50 text-black">
        <div className="bg-white/10 w-full h-fit">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post: PostData) => (
              <Post key={post.id} e={post} />
            ))
          ) : (
            <p className='p-[15px]'>게시물이 없어요 ㅠㅠ</p>
          )}
        </div>
      </div>
      <div ref={observerTarget}></div>
      {isFetchingNextPage && <p>Loading more...</p>}
    </div>
  );
};

export default PostList;
