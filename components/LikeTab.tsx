'use client';
import { threadUserLike } from '@/lib/Actions/CreateThreads';
import { useEffect, useState } from 'react';
import ThreadCard from './ThreadCard';

const LikeTab = ({ user }: any) => {
  const [data, setdata] = useState([]);
  const userLike = async () => {
    const res = await threadUserLike(user._id);
    setdata(JSON.parse(res));
  };
  useEffect(() => {
    userLike();
  }, []);
  return (
    <div className="flex flex-col gap-2">
      {data?.map((post: any, i: number) => (
        <ThreadCard
          post={post}
          key={i}
          thread={false}
          userid={user._id}
          user={user}
        />
      ))}
    </div>
  );
};

export default LikeTab;
