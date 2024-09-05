import axios from "axios";

interface PostType {
  id: number;
  text: string;
  tags: string[];
  email: string;
}

const getPosts = async (): Promise<PostType[]> => {
  const response = await axios.get<PostType[]>('/api/posts');
  return response.data;
};

export default getPosts;
