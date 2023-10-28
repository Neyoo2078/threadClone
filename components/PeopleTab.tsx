'use client';
import { useState, useEffect } from 'react';
import { fetchTopTreadQuery } from '@/lib/Actions/CreateThreads';
import ThreadCard from './ThreadCard';
import { currentUser } from '@clerk/nextjs';
import { getValueUsers } from '@/lib/Actions/User';
import UserCard from './UserCard';
const PeopleTab = ({ value, currentusers }: any) => {
  const [users, setusers] = useState({ res: [], res2: [] });
  console.log({ users });
  const getUser = async () => {
    const res = await getValueUsers(value);
    setusers(JSON.parse(res));
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div>
      {users.res.length === 0 ? (
        <div className="w-full font-semibold text-[25px] flex justify-center">
          <h1>No result for "{value}"</h1>
        </div>
      ) : (
        <div>
          {' '}
          {users.res.map(() => (
            <UserCard />
          ))}{' '}
        </div>
      )}
    </div>
  );
};

export default PeopleTab;
