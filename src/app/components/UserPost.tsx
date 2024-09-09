"use client"
import AddComment from './AddComment';
import CommentList from './CommentList';
import axios from 'axios';
import React, {useState, useRef, useEffect} from 'react';

interface PostData {
    user_id: number;
    id: number;
    title: string;
    content: string;
    user_nickname: string;
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
        if (!e.user_id) return; 
        setLoading(true); 
        setError(null); 
        
        try {
            const response = await axios.delete(`/api/posts?id=${e.user_id}`);
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
                <p className={`text-black cursor-pointer`}>{e.user_nickname}</p>
                <button className='hover:underline' onClick={() => handleClickDelete()}>삭제</button>
            </div>
            <p className={`text-black cursor-pointer`}>{e.title}</p>
            <div 
                ref={textRef}
                className={`${isExpanded ? '' : 'line-clamp-5'} py-[10px]`}
            >
                {e.content}
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
            <div className="w-full h-[30px] border-black/15 flex items-center">
                <button 
                    className="w-fit h-fit p-[5px] hover:bg-black/5 rounded-full transition-transform duration-100 active:scale-90 focus:outline-none" 
                    onClick={()=> setShowComment(!showComment)}
                >
                    <img className="w-[20px] h-auto font-[300] text-black bg-transparent" src="./commentsIcon.svg" alt='Comments Icon' />
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
