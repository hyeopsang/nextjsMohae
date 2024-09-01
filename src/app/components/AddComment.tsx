import React, {useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface PostIdProps {
    postId: number;
  }

const AddComment:React.FC<PostIdProps> = ({postId}) => {
    const { data: session } = useSession();
    const [comment, setComment] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const userId = session?.user?.email ?? '';

    const onChangeComment = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    }

    const onSubmit = async () => {
        try {
            await axios.post('/api/comments', {
                email: userId,
                text: comment,
                postId: postId,
            });
            setComment(''); 
            setError(null); 
            location.reload();
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Failed to submit comment:", error.response.data);
                setError(error.response.data.error || "Failed to submit comment. Please try again.");
            } else {
                console.error("Failed to submit comment:", error);
                setError("Failed to submit comment. Please try again.");
            }
        }
    }
    
    return (
        <div className="w-full flex justify-between items-center text-black pb-[15px]">
            <input className="w-[450px] h-[35px] px-[15px] rounded-full bg-black/5" placeholder="서로 존중하며 대화해요" value={comment} onChange={onChangeComment}/>
            <button className="w-[35px] aspect-square rounded-full bg-black/5 hover:bg-black/10 flex justify-center items-center" onClick={() => onSubmit()}>
            <span className="material-symbols-outlined ml-[2px]">
                keyboard_arrow_right
            </span>
            </button>
        </div>
    )
}

export default AddComment;
