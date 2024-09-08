import React, {useState} from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface CommentData {
    id: number
    content: string;
    user_id: string;
    user_nickname: string;
}
interface CommentProps {
    e: CommentData;
}



const Comments:React.FC<CommentProps> = ({e}) => {
    const { data: session } = useSession();
    const userId = session?.user?.email ?? '';
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null); 

    const handleClickDelete = async() => {
        if (!e.id) {
            alert("로그인 해주세요");
            return
        }; 
        setLoading(true); 
        setError(null); 
        
        try {
            const response = await axios.delete(`/api/comments?id=${e.id}`);
            location.reload();
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setError('Failed to fetch posts'); 
        } finally {
            setLoading(false); 
        }
    }

    return (
        <div className="w-full my-[5px] py-[15px] border-b border-black/15">
            <div className="w-full flex justify-between">
            <p>{e.user_nickname}</p>
            {
                userId === e.user_id ?
                <button onClick={() => handleClickDelete()}>삭제</button>
                : undefined
            }
            </div>
            <p>{e.content}</p>
        </div>
    )
}
export default Comments;
