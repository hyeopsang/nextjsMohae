import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Comments from "./Comments";
interface CommentData {
    id: number;
    content: string;
    user_id: string;
    user_nickname: string;
}

interface PostIdProps {
  postId: number;
}

const fetchComments = async (postId: number): Promise<CommentData[]> => {
  const response = await axios.get(`/api/comments?post_id=${postId}`);
  return response.data;
};

const CommentList: React.FC<{ postId: number }> = ({ postId }) => {
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => fetchComments(postId),
    enabled: !!postId,
    staleTime: 10000
  });

  if (isLoading) return <p>댓글을 불러오는 중...</p>;

  if (error) return <p>댓글을 불러오는 데 문제가 발생했습니다.</p>;

  if (!comments || comments.length === 0) {
    return <p className='p-[15px]'>댓글이 없어요 ㅠㅠ</p>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <Comments key={comment.id} e={comment} />
      ))}
    </div>
  );
};

export default CommentList;
