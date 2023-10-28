'use client';
import { fetchRepies } from '@/lib/Actions/CreateThreads';
import { useEffect, useState } from 'react';
import ThreadCard from './ThreadCard';

const ReplyTab = ({ user }: any) => {
  const [data, setdata] = useState([]);
  console.log({ data });

  const replies = async () => {
    const res = await fetchRepies(user._id);
    setdata(JSON.parse(res));
  };
  useEffect(() => {
    replies();
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

export default ReplyTab;
