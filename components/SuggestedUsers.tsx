'use client';
import { useState, useEffect } from 'react';
import { getsuggestedUsers } from '@/lib/Actions/User';
import { allUsers } from '@/lib/Actions/User';

const SuggestedUsers = ({ userid, user }: any) => {
  const fetchSuggestedUsers = async () => {
    const res = await getsuggestedUsers(userid);
    console.log({ SuggestedRes: JSON.parse(res) });
  };
  console.log({ user });
  const getAllUsers = async () => {
    const res = await allUsers();
    console.log({ resDD: JSON.parse(res) });
    const filterusers = JSON.parse(res).filter((item: any) => {
      const exist = user.followers.find(
        (items: any) => items === item._id.toString()
      );

      if (!exist) {
        return item;
      }
    });
    console.log({ filterusers });
  };

  useEffect(() => {
    fetchSuggestedUsers();
    getAllUsers();
  }, []);
  return <div>SuggestedUsers</div>;
};

export default SuggestedUsers;
