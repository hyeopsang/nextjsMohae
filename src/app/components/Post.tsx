"use client";
import React, { useState, useEffect, useRef } from "react";
import CommentList from "./CommentList";
import AddComment from "./AddComment";
import Image from "next/image";

interface PostData {
    id: number;
    text: string;
    tags: string[];
    email: string;
}

interface PostProps {
    e: PostData;
}

const Post: React.FC<PostProps> = ({ e }) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showButton, setShowButton] = useState<boolean>(false);
    const textRef = useRef<HTMLDivElement>(null);
    const [showComment, setShowComment] = useState(false);

    const handleClickExpand = () => {
        setIsExpanded(!isExpanded);
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
        <div className={`h-fit px-[25px] py-[15px] border-b-2 text-white bg-white/15 border-white/5`}>
            <div className="flex items-center">
                <p className={`cursor-pointer`}>{e.email}</p>
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
                {e.tags.map((tag, id) => (
                    <p key={id} className={`px-[15px] py-[5px] rounded-full cursor-pointer hover:underline text-white bg-white/15`}>
                        # {tag}
                    </p>
                ))}
            </div>
            <div className="w-full h-[30px] border-white/15 flex justify-end items-center">
                <button className="w-fit h-fit" onClick={()=> setShowComment(!showComment)}>
                    <img className="w-[30px] h-auto font-[300] text-white bg-transparent" src="./commentsIcon.svg" alt="Comments Icon"/>
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
    );
};

export default Post;
