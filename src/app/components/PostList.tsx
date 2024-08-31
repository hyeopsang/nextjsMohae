"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from './Post';
import Search from './Search';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface PostData {
    id: number;
    text: string;
    tags: string[];
    email: string;
}

const PostList: React.FC = () => {
    const { data: session, status } = useSession();
    const [postList, setPostList] = useState<PostData[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);

    if (!session) {
        redirect('/login'); 
      }

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPostList(response.data);
                setFilteredPosts(response.data); 
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        const filtered = postList.filter(post =>
            post.text.toLowerCase().includes(lowercasedQuery) ||
            post.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)) ||
            post.email.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredPosts(filtered);
    }, [searchQuery, postList]);

    return (
        <div>
            <Search onSearch={setSearchQuery} />
            <div className="w-[35%] h-fit overflow-hidden bg-transparent rounded-t-[25px] mx-auto border-2 border-white/15 z-50 text-white">
                <div className="bg-black/10 w-full h-fit">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                            <Post key={index} e={post} />
                        ))
                    ) : (
                        <p className='p-[15px]'>게시물이 없어요 ㅠㅠ</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostList;
