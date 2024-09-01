
import React, { useState } from "react";
import { useTheme } from '../themeContext';
import { useSession } from "next-auth/react";
import axios from "axios";
import { redirect } from "next/navigation";

interface AddPostProps {
  onPostAdded?: () => void; 
}

const AddPost: React.FC<AddPostProps> = ({ onPostAdded }) => {
    const { data: session } = useSession();
    const { addPost, setAddPost } = useTheme(); 
    const [tags, setTags] = useState<string[]>([]);
    const [tagTxt, setTagTxt] = useState<string>('');
    const [mainTxt, setMainTxt] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const userId = session?.user?.email ?? '';

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

    const onSubmit = async () => {
        if (!session) {
            alert("로그인 해주세요");
            return;
        }
      
        try {
            const response = await axios.post('/api/posts', {
                email: userId,
                text: mainTxt,
                tags: tags,
            });
            if (onPostAdded) onPostAdded();
            setAddPost(false);
            location.reload();
        } catch (error) {
            console.error("Failed to submit post:", error);
            setError("Failed to submit post. Please try again.");
        }
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
                <div 
                    onClick={onSubmit} 
                    className={`mt-[15px] px-[15px] py-[5px] border rounded-[10px] ${mainTxt.length > 0 ? 'text-white cursor-pointer' : 'text-white/20'}`}
                >
                    게시
                </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}

export default AddPost;
