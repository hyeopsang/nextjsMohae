import React from 'react';
import PostList from './components/PostList';
import axios from 'axios';

export default async function Home() {
  return (
    <div className="w-full bg-white overflow-y-scroll">
    <PostList  />
  </div>
  );
}
