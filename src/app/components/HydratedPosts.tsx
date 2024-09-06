import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import React from 'react';
import PostList from './PostList';
import getPosts from "./getPost";

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="w-full bg-white">
        <PostList />
      </div>
    </HydrationBoundary>
  );
}
