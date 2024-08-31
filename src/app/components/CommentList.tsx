import React, { useEffect, useState } from "react";
import axios from "axios";
import Comments from "./Comments";
interface CommentData {
    id: number;
    text: string;
    email: string;
}

interface PostIdProps {
  postId: number;
}

const CommentList:React.FC<PostIdProps> = ({postId}) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const fetchPosts = async () => {
      if (!postId) return;
      
      setLoading(true); 
      setError(null); 
      
      try {
        const response = await axios.get(`/api/comments?post_id=${postId}`);
        setComments(response.data); 
      } catch (error) {
        console.error('Failed to fetch comments:', error);
        setError('Failed to fetch comments'); 
      } finally {
        setLoading(false); 
      }
    };

    fetchPosts();
  }, [postId]);
  
    return (
        <div>
          {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Comments key={index} e={comment} />
                        ))
                    ) : (
                        <p className='p-[15px]'>댓글이 없어요 ㅠㅠ</p>
                    )}
          
        </div>
    )
}
export default CommentList;
