'use client'

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import React, { useState, useMemo } from 'react';
import Post from './Post';
import Search from './Search';
import getPosts from './getPost';
import axios from 'axios';
import { useSession } from "next-auth/react";
import { useTheme } from '../utils/themeContext';


interface PostData {
  id: number;
  text: string;
  tags: string[];
  email: string;
}
interface AddPostProps {
  onPostAdded?: () => void; 
}

interface PostData {
    id: number;
    text: string;
    tags: string[];
    email: string;
  }
const AddPost: React.FC<AddPostProps> = () => {
    const { data: session } = useSession();
    const userId = session?.user?.email ?? '';
    const [tags, setTags] = useState<string[]>([]);
    const [tagTxt, setTagTxt] = useState<string>('');
    const [mainTxt, setMainTxt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const { setAddPost } = useTheme();
    
    const queryClient = useQueryClient();
    const { refetch } = useQuery({ queryKey: ['posts'] });

    const mutation = useMutation<PostData, Error, Omit<PostData, 'id'>>({
        mutationFn: async (newPost) => await axios.post<PostData>('/api/posts', newPost).then(res => res.data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          refetch()
          setMainTxt('');
          setTags([]);
          setTagTxt('');
          setAddPost(false);
        },
        onError: (error) => {
          console.error("Failed to submit post:", error);
          setError("Failed to submit post. Please try again.");
        }
      });
      
      const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          mutation.mutate({ email: userId, text: mainTxt, tags });
        } catch (error) {
          console.log(error);
        }
      };

      

    const handleChangeTxt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMainTxt(e.target.value);
    }

    const handleClickAddTag = () => {
        if (tagTxt.trim() !== '' && tags.length < 5) {
            setTags([...tags, tagTxt]);
            setTagTxt('');
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagTxt(e.target.value);
    }

    return (
        <div className="w-[420px] h-fit p-[20px] border border-black/15 bg-[#222] rounded-[15px] flex flex-wrap items-end">
            <textarea 
                placeholder="내용을 작성해 주세요" 
                className="w-full h-[200px] bg-transparent p-2 rounded mb-2 text-white" 
                value={mainTxt} 
                onChange={handleChangeTxt}
            />
            <div className="w-full flex">
                <input
                    placeholder="태그 최대 5개"
                    value={tagTxt}
                    onChange={handleInputChange}
                    className="flex-grow p-2 border rounded-l text-white bg-transparent"
                />
                <button
                    type="button"
                    onClick={handleClickAddTag}
                    className="p-2 bg-white/5 text-white border rounded-r"
                >
                    추가
                </button>
            </div>
            <div className='w-full h-fit px-[5px] flex justify-start items-start flex-wrap gap-2 mt-2'>
                {tags.map((tag, index) => 
                    <p key={index} className={`px-[15px] py-[5px] rounded-full cursor-pointer hover:underline text-black bg-white`}>
                        # {tag}
                    </p>
                )}
            </div>
            <div className="w-full flex justify-end">
            {mutation.isPending ? (
                    'Adding todo...'
                ) : (
                    <>
                    {mutation.isError ? (
                        <div>An error occurred: {mutation.error.message}</div>
                    ) : null}

                    {mutation.isSuccess ? <div>Todo added!</div> : null}
                    <form onSubmit={onSubmit}>
                    <button 
                        type="submit"
                        disabled={mainTxt.length === 0}
                        className={`mt-[15px] px-[15px] py-[5px] border rounded-[10px] ${mainTxt.length > 0 ? 'text-white cursor-pointer' : 'text-white/20'}`}
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



const PostList: React.FC = () => {
  const { addPost, setAddPost } = useTheme()
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { data, error, isLoading, refetch } = useQuery<PostData[]>({
    queryKey: ['posts'],
    queryFn: getPosts,
    staleTime: 60000,
  });
  const onChangeAddPost = () => {
    setAddPost(!addPost);
  };

  const Posts = data?.sort((a, b)=> b.id - a.id);
  const filteredPosts = useMemo(() => {
    if (!Posts) return []
    const lowercasedQuery = searchQuery.toLowerCase()
    return Posts.filter(post =>
      post.text.toLowerCase().includes(lowercasedQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)) ||
      post.email.toLowerCase().includes(lowercasedQuery)
    )
  }, [searchQuery, data])

  if (isLoading) return <p>Loading...</p>
  if (error) return <p>An error occurred</p>

  return (
    <div>
      {addPost && <div className='fixed w-screen h-screen flex justify-center items-center bg-white/70'><AddPost/></div>}
      <Search onSearch={setSearchQuery} />
      <button className='w-[35%] h-2' onClick={() => refetch()}>새로고침</button>
      <button className='w-[35%] h-2' onClick={onChangeAddPost}>추가
      </button>
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
