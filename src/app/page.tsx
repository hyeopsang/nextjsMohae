import React from 'react';
import PostList from './components/PostList';

export default async function Home() {
  return (
    <div className="w-full bg-white overflow-y-scroll">
    <PostList  />
  </div>
  );
}
