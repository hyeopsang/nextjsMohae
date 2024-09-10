"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import CommentList from "./CommentList";
import AddComment from "./AddComment";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Session } from "inspector";
import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

interface PostData {
    id: number;
    title: string;
    content: string;
    user_id: string;
    user_nickname: string;
}

interface PostProps {
    e: PostData;
}
interface Like {
    id: string;
    user_id: string;
    user_nickname: string;
    post_id: string;
    created_at: string;
  }

// 좋아요 토글 함수
export async function toggleLike(userId: string, userNickname: string, postId: string) {
    try {
      const response = await axios.post('/api/likes', {
        user_id: userId,
        user_nickname: userNickname,
        post_id: postId
      });
  
      console.log(response.data.message);
      // 여기서 UI를 업데이트하거나 다른 작업을 수행할 수 있습니다.
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error toggling like:', error.response?.data.error || error.message);
      } else {
        console.error('Error toggling like:', error);
      }
      throw error;
    }
  }
  
  // 특정 게시물의 좋아요 목록 가져오기
  export async function getLikes(postId: string) {
    try {
      const response = await axios.get(`/api/likes?post_id=${postId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error fetching likes:', error.response?.data.error || error.message);
      } else {
        console.error('Error fetching likes:', error);
      }
      throw error;
    }
  }
  
  // 좋아요 삭제 (필요한 경우)
  export async function deleteLike(likeId: string) {
    try {
      const response = await axios.delete(`/api/likes?id=${likeId}`);
      console.log(response.data.message);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error deleting like:', error.response?.data.error || error.message);
      } else {
        console.error('Error deleting like:', error);
      }
      throw error;
    }
  }
   
  

const Post: React.FC<PostProps> = ({ e }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>(null);
    const [showComment, setShowComment] = useState(false);
    const {data: session} = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const handleClickExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const toggleComments = useCallback( async() => {
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
          }else{
            setShowComment(prev => !prev);

          }
    }, []);

    // 좋아요 데이터 쿼리
    const { data: likes = [], isLoading: likesLoading } = useQuery({
        queryKey: ['likes', e.id],
        queryFn: () => getLikes(e.id.toString()),
        staleTime: 60000, // 1분동안 데이터를 "신선"하다고 간주
        gcTime: 3600000, // 1시간동안 캐시 유지 (v5에서 cacheTime이 gcTime으로 변경됨)
    });

    const isLiked = likes.some((like: { user_id: string | undefined; }) => like.user_id === session?.user?.id);    const toggleLikeMutation = useMutation({
        mutationFn: () => toggleLike(
            session?.user?.user_id || '', 
            session?.user?.user_nickname || '', 
            e.id.toString()
        ),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['likes', e.id] });
            const previousLikes = queryClient.getQueryData(['likes', e.id]);
        
            queryClient.setQueryData(['likes', e.id], (old: any[]) => {
                const userId = session?.user?.id;
                if (old.some(like => like.user_id === userId)) {
                    return old.filter(like => like.user_id !== userId);
                } else {
                    return [...old, { user_id: userId, user_nickname: session?.user?.user_nickname }];
                }
            });
        
            return { previousLikes };
        },
        onError: (err, variables, context) => {
            // 에러 발생 시 이전 데이터로 롤백
            queryClient.setQueryData(['likes', e.id], context?.previousLikes);
        },
        
    });

    const handleToggleLike = async () => {
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
            }
            return;
        }
    
        toggleLikeMutation.mutate();
    };
    

    useEffect(() => {
        const checkTextOverflow = () => {
            if (textRef.current) {
                const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
                const height = textRef.current.scrollHeight;
                const lines = Math.floor(height / lineHeight);
                setShowButton(lines > 5);
            }
        };

        checkTextOverflow();
        window.addEventListener('resize', checkTextOverflow);
        return () => window.removeEventListener('resize', checkTextOverflow);
    }, [isExpanded]);

    return (
        <div className={`h-fit px-[25px] py-[15px] border-b-2 text-black bg-white/15 border-black/5`}>
            <div className="flex justify-between items-center">
                <p className={`cursor-pointer`}>{e?.user_nickname}</p>
            </div>
            <p className="cursor-default">{e?.title}</p>
            <div
                ref={textRef}
                className={`${isExpanded ? '' : 'line-clamp-5'} py-[10px]`}
            >
                {e.content}
            </div>
            {showButton && (
                <button 
                    onClick={handleClickExpand}
                    aria-label={isExpanded ? "줄이기" : "더보기"}
                >
                    {isExpanded ? "줄이기" : "...더보기"}
                </button>
            )}
            <div className="w-full h-[30px] border-black/15 flex items-center">
            <button 
                    className="w-fit h-fit py-[3px] px-[10px] gap-[5px] flex items-center hover:bg-black/5 rounded-full transition-transform duration-100 active:scale-90 focus:outline-none" 
                    onClick={handleToggleLike}
                    aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                    disabled={toggleLikeMutation.isPending}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="18"
                        viewBox="0 0 24 24"
                        fill={isLiked ? "red" : "none"}
                        stroke={isLiked ? "red" : "black"}
                        strokeWidth="1.5"
                    >
                        <path
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                        />
                    </svg>
                    <p className="mt-[2px]">{likes.length}</p>
                </button>
                <button 
                    className="w-fit h-fit p-[6px] hover:bg-black/5 rounded-full transition-transform duration-100 active:scale-90 focus:outline-none" 
                    onClick={toggleComments}
                    aria-label={showComment ? "댓글 숨기기" : "댓글 보기"}
                >
                    <img className="w-[20px] h-auto font-[300] text-black bg-transparent" src="./commentsIcon.svg" alt="Comments Icon"/>

                </button>
            </div>
            <div className={
                showComment ? "w-full h-fit pt-[15px]" : "h-0 overflow-hidden"
            }>
                <AddComment postId={e.id}/>
                <CommentList postId={e.id}/>
            </div>    
        </div>
    );
};

export default Post;
