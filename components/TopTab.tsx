'use client';
import { useState, useEffect } from 'react';
import { fetchTopTreadQuery } from '@/lib/Actions/CreateThreads';
import ThreadCard from './ThreadCard';
import { currentUser } from '@clerk/nextjs';
import { getValueUsers } from '@/lib/Actions/User';

const TopTab = ({
  value,
  currentusers,
}: {
  value: string;
  currentusers: any;
}) => {
  const [users, setusers] = useState({ res: [], res2: [] });
  console.log({ topvalue: value });
  const getUser = async () => {
    const res = await getValueUsers(value);
    setusers(JSON.parse(res));
  };

  useEffect(() => {
    getUser();
  }, []);

  // const res = await fetchTopTreadQuery(value);
  // const ress = JSON.parse(res);
  return (
    <div>
      {users.res2.map((post: any, i: any) => (
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

export default TopTab;
