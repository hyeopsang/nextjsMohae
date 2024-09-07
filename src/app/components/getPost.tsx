import axios from "axios";

interface PostData {
  id: number;
  text: string;
  tags: string[];
  email: string;
}

interface PostsResponse {
  filter(arg0: (post: PostData) => boolean): any;
  posts: PostData[];
}

const getPosts = async (): Promise<PostsResponse> => {
  const response = await axios.get<PostsResponse>('/api/posts');
  return response.data;
};

export default getPosts;
