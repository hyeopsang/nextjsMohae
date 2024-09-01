"use client"
import AddComment from './AddComment';
import CommentList from './CommentList';
import axios from 'axios';
import Image from 'next/image';
import React, {useState, useRef, useEffect} from 'react';

interface PostData {
    id: number
    text: string;
    tags: string[];
    email: string;
}

interface PostProps {
    e: PostData;
}

const UserPost: React.FC<PostProps> = ({ e }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null); 
    const textRef = useRef<HTMLDivElement>(null);
    const [showComment, setShowComment] = useState(false);

    const handleClickExpand = () => {
        setIsExpanded(!isExpanded);
    }
    const handleClickDelete = async() => {
        if (!e.id) return; 
        setLoading(true); 
        setError(null); 
        
        try {
            const response = await axios.delete(`/api/posts?id=${e.id}`);
            location.reload();
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setError('Failed to fetch posts'); 
        } finally {
            setLoading(false); 
        }
    }

    useEffect(() => {
        const checkTextOverflow = () => {
            if (textRef.current) {
                // 임시로 line-clamp 제거
                textRef.current.classList.remove('line-clamp-5');
                
                const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
                const height = textRef.current.scrollHeight;
                const lines = Math.floor(height / lineHeight);
                
                if (!isExpanded) {
                    textRef.current.classList.add('line-clamp-5');
                }
                
                setShowButton(lines > 5);
            }
        };

        checkTextOverflow();
        window.addEventListener('resize', checkTextOverflow);
        return () => window.removeEventListener('resize', checkTextOverflow);
    }, [isExpanded]);
    return (
        <div className={`w-full h-fit px-[25px] py-[15px] border-b-2 text-black bg-white/15 border-black/5`}>
            <div className="flex items-center justify-between">
                <p className={`text-black cursor-pointer`}>{e.email}</p>
                <button className='hover:underline' onClick={() => handleClickDelete()}>삭제</button>
            </div>
            <div 
                ref={textRef}
                className={`${isExpanded ? '' : 'line-clamp-5'} py-[10px]`}
            >
                {e.text}
            </div>
            {showButton && !isExpanded && (
                <button onClick={handleClickExpand}>
                    ...더보기
                </button>
            )}
            {isExpanded && (
                <button onClick={handleClickExpand}>
                    줄이기
                </button>
            )}
            <div className='w-full px-[5px] flex flex-wrap gap-2 pb-[15px]'>
            {
                e.tags.map((tag, id) => {
                    return (
                        <p key={id} className={`px-[15px] py-[5px] rounded-full cursor-pointer hover:underline text-black bg-black/5`}>
                            # {tag}
                        </p>
                    );
                })
            }
            </div>
            <div className="w-full h-[30px] border-black/15 flex justify-end items-center">
                <button className="w-fit h-fit" onClick={()=> setShowComment(!showComment)}>
                    <img className="w-[30px] h-auto font-[300] text-black bg-transparent" src="./commentsIcon.svg" alt='Comments Icon' />
                </button>
            </div>
            <div className={
                showComment === false ? 
                "h-0 overflow-hidden"
                : "w-full h-fit pt-[15px]"
            }>
                <AddComment postId={e.id}/>
                <CommentList postId={e.id}/>
            </div>    
        </div>
    )
}
export default UserPost;
