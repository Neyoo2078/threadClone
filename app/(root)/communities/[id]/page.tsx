import { currentUser } from '@clerk/nextjs';
import React from 'react';
import { fetchUser } from '@/lib/Actions/User';
import { redirect } from 'next/navigation';
import { fetchCommunityPosts } from '@/lib/Actions/community';

import CommunityBanner from '@/components/CommunityBanner';

const page = async ({ params }: { params: { id: string } }) => {
  const userDatas = await currentUser();

  if (!userDatas) return null;

  const userinfo: any = await fetchUser({ userid: userDatas?.id });
  const users = JSON.parse(userinfo);

  if (!users) {
    redirect('/onboarding');
  }

  const communityDetails = await fetchCommunityPosts(params.id);
  const commune = JSON.parse(communityDetails);

  return (
    <div className="text-[white]">
      <CommunityBanner users={users} params={params} commune={commune} />
    </div>
  );
};

export default page;
