"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import CommentList from "./CommentList";
import AddComment from "./AddComment";
import Image from "next/image";

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

const Post: React.FC<PostProps> = ({ e }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>(null);
    const [showComment, setShowComment] = useState(false);

    const handleClickExpand = useCallback(() => {
        setIsExpanded(prev => !prev);
    }, []);

    const toggleComments = useCallback(() => {
        setShowComment(prev => !prev);
    }, []);

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
                    className="w-fit h-fit p-[5px] hover:bg-black/5 rounded-full transition-transform duration-100 active:scale-90 focus:outline-none" 
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
