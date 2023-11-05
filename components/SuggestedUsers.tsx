'use client';
import { useState, useEffect } from 'react';
import { getsuggestedUsers } from '@/lib/Actions/User';
import { allUsers } from '@/lib/Actions/User';
import FollowCard from './FollowCard';

const SuggestedUsers = ({ userid, user }: any) => {
  const [AllFollow, setAllFollow] = useState([]);
  const fetchSuggestedUsers = async () => {
    const res = await getsuggestedUsers(userid);
    console.log({ SuggestedRes: JSON.parse(res) });
  };
  console.log({ suggestedUser: user });
  const getAllUsers = async () => {
    const res = await allUsers();
    console.log({ resDD: JSON.parse(res) });
    const filterusers = JSON.parse(res).filter((item: any) => {
      const exist = user.following.find(
        (items: any) => items === item._id.toString()
      );

      if (!exist) {
        return item;
      }
    });

    const removeActiveUser = filterusers.filter(
      (items: any) => items._id.toString() !== user._id
    );
    setAllFollow(removeActiveUser);
  };

  useEffect(() => {
    fetchSuggestedUsers();
    getAllUsers();
  }, []);
  return (
    <div className="bg-[#3c3b3b7c] p-3 rounded-md">
      <h1 className="text-[20px] mb-5 font-bold text-white">Who to follow</h1>
      <div className="flex flex-col gap-2">
        {AllFollow.slice(0, 3).map((items, i) => (
          <FollowCard user={items} suggest users={user} key={i} />
        ))}
        {AllFollow.length > 3 && (
          <h1 className="text-[#5a9af3] italic">show more</h1>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
