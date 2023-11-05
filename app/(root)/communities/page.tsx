import React from 'react';
import CommunityTopBar from '@/components/CommunityTopBar';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import { redirect } from 'next/navigation';
import CommunityList from '@/components/CommunityList';

const page = async () => {
  const userDatas = await currentUser();

  if (!userDatas) return null;

  const userinfo: any = await fetchUser({ userid: userDatas?.id });
  const user = JSON.parse(userinfo);
  if (!user) {
    redirect('/onboarding');
  }
  return (
    <div className="w-full text-white pt-[10px]">
      <CommunityTopBar user={user} />
      <h1 className="text-[25px] font-bold my-[25px]">Discover Communities</h1>
      <CommunityList />
    </div>
  );
};

export default page;
