'use client';
import Link from 'next/link';
import ThreadCard from './ThreadCard';

const Comments = ({ posts }: { posts: [] }) => {
  const isComment = posts.length > 0;
  return (
    <div
      className={`text-white flex flex-col gap-3 w-full rounded- ${
        isComment ? 'px-0 xs:px-7' : 'bg-dark-2 p7'
      }`}
    >
      {posts.map((post, i) => (
        <ThreadCard key={i} post={post} />
      ))}
    </div>
  );
};

export default Comments;
