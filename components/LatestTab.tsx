'use client';
import ThreadCard from './ThreadCard';
import { getLatestThreads } from '@/lib/Actions/CreateThreads';
import { useEffect, useState } from 'react';

const LatestTab = ({ value, currentusers }: any) => {
  const [users, setusers] = useState([]);
  console.log({ latestUser: users });
  console.log({ latestvalue: value });
  const latestThreads = async (values: string) => {
    const res = await getLatestThreads(values);
    setusers(JSON.parse(res));
  };

  useEffect(() => {
    latestThreads(value);
  }, []);
  return (
    <div>
      {users.map((post: any, i: any) => (
        <ThreadCard
          key={i}
          post={post}
          thread={false}
          userid={currentusers?._id}
          user={currentusers}
        />
      ))}
    </div>
  );
};

export default LatestTab;
