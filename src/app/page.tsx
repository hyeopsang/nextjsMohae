import React from 'react';
import HydratedPosts from "./components/HydratedPosts";

export default function Home() {
  return (
    <div className="w-full bg-white overflow-y-scroll">
      <HydratedPosts />
    </div>
  );
}
