import React, { useState, useEffect } from "react";
import { useTheme } from '../utils/themeContext';
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface AddPostProps {
  onPostAdded?: () => void; 
}

interface PostType {
    id: number; // 서버에서 생성된 id를 포함
    text: string;
    tags: string[];
    email: string;
}

const AddPost: React.FC<AddPostProps> = ({ onPostAdded }) => {
    const { data: session } = useSession();
    const userId = session?.user?.email ?? '';
    const { setAddPost } = useTheme(); 
    const [tags, setTags] = useState<string[]>([]);
    const [tagTxt, setTagTxt] = useState<string>('');
    const [mainTxt, setMainTxt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    
    const queryClient = useQueryClient();

    const mutation = useMutation<PostType, Error, Omit<PostType, 'id'>>({
        mutationFn: (newPost) => axios.post<PostType>('/api/posts', newPost).then(res => res.data),
        onSuccess: () => {
            // 게시물 추가 성공 후 'posts' 쿼리를 무효화하여 새로운 GET 요청을 트리거합니다.
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.refetchQueries({ queryKey: ['posts'] });
            if (onPostAdded) onPostAdded();
            setAddPost(false);
            // 입력 필드 초기화
            setMainTxt('');
            setTags([]);
            setTagTxt('');
        },
        onError: (error) => {
            console.error("Failed to submit post:", error);
            setError("Failed to submit post. Please try again.");
        }
    });

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

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) {
            alert("로그인 해주세요");
            return;
        }
        mutation.mutate({ email: userId, text: mainTxt, tags });
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
                <form onSubmit={onSubmit}>
                    <button 
                        type="submit"
                        disabled={mainTxt.length === 0}
                        className={`mt-[15px] px-[15px] py-[5px] border rounded-[10px] ${mainTxt.length > 0 ? 'text-white cursor-pointer' : 'text-white/20'}`}
                    >
                        게시
                    </button>
                </form>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default AddPost;
