'use client';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { addMemberToCommunity } from '@/lib/Actions/community';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BsFillPeopleFill } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';
import { SlCalender } from 'react-icons/sl';
import FollowCard from '@/components/FollowCard';
import { getTimeDifference } from '@/lib/dateFormat';
import MemberList from '@/components/MemberList';
import ThreadCard from './ThreadCard';

const CommunityBanner = ({ users, params, commune: communityDetails }: any) => {
  console.log({ communityDetails });
  const ActiveUserExistInCommunity = communityDetails?.members.find(
    (items: any) => items._id.toString() === users._id
  );

  const handleJoinCommunity = async () => {
    await addMemberToCommunity(communityDetails._id, users._id);
  };
  return (
    <div>
      <div className="w-full h-[170px] bg-[#2fb4be] p-3 flex">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className=" text-[20px] sm:text-[20px] lg:text-[25px] 2xl:text-[30px] font-semibold">
              {communityDetails?.name.toUpperCase()}
            </h1>
            <h1 className=" text-[13px]  lg:text-[14px] 2xl:text-[14px] italic">
              {communityDetails?.bio}
            </h1>
          </div>
          <div className="flex justify-between w-full">
            <div className="flex gap-3 items-center">
              <div>
                <AvatarGroup max={4}>
                  {communityDetails.members.map((items: any, i: number) => (
                    <Avatar
                      sx={{ width: 30, height: 30 }}
                      key={i}
                      alt="Remy Sharp"
                      src={items.image}
                    />
                  ))}
                </AvatarGroup>
              </div>
              <div>{communityDetails.members.length} Members</div>
            </div>
            {!ActiveUserExistInCommunity ? (
              <button
                onClick={handleJoinCommunity}
                className="py-2 px-4 font-semibold cursor-pointer text-[15px] hover:border-[1px] border-slate-200 hover:bg-transparent rounded-[25px] bg-slate-200"
              >
                Join
              </button>
            ) : (
              <button
                onClick={handleJoinCommunity}
                className="py-2 px-4 font-semibold cursor-pointer text-[15px] hover:border-[1px] border-slate-200 hover:bg-transparent rounded-[25px] bg-slate-200"
              >
                Unsubscribe
              </button>
            )}
          </div>
        </div>
      </div>
      <Tabs defaultValue="Threads" className="w-full mt-[40px]">
        <TabsList className="w-full">
          <TabsTrigger className="w-[50%]" value="Threads">
            Threads
          </TabsTrigger>
          <TabsTrigger className="w-[50%]" value="About">
            About
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Threads">
          {communityDetails.threads.length === 0 ? (
            <div>No thread Available</div>
          ) : (
            <div className="flex flex-col gap-2">
              {communityDetails.threads.map((items: any, i: number) => (
                <ThreadCard
                  post={items}
                  thread={false}
                  userid={users._id}
                  user={users}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="About">
          <div>
            <h1 className="my-[20px] text-[20px] font-semibold">
              {' '}
              Community Info
            </h1>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-center">
                <BsFillPeopleFill className="w-[30px] h-[30px]" />
                <h1>Only members can post, like, or reply.</h1>
              </div>
              <div className="flex gap-3 items-center">
                <BiWorld className="w-[30px] h-[30px]" />{' '}
                <h1>
                  All Communities are publicly visible.Anyone can join this
                  Community.
                </h1>
              </div>

              <div className="flex gap-3 items-center">
                <SlCalender className="w-[30px] h-[30px]" />
                <h1>Created by @{communityDetails.createdBy.username}</h1>
              </div>
            </div>
            <hr className="my-[10px]" />
            <div className="flex flex-col gap-3">
              <h1 className="mt-[20px] text-[20px] font-semibold">Rules</h1>
              <h1>
                These are set and enforced by Community admins and are in
                addition to Threads’s rules.
              </h1>
              <div className="flex gap-2">
                <div className="bg-[#2fb4be] w-[30px] flex items-center justify-center h-[30px] ">
                  1
                </div>
                <h1>
                  {' '}
                  No bullying No form of bullying, personal attacks or threats
                  will be tolerated.
                </h1>{' '}
              </div>
              <div className="flex gap-2">
                <div className="bg-[#2fb4be] w-[30px] flex items-center justify-center  h-[30px] ">
                  2
                </div>
                <h1>
                  {' '}
                  Be kind and respectful Have fun and invite your friends!
                </h1>
              </div>
            </div>
            <div>
              <h1 className="text-[25px] font-semibold my-[15px]">Moderator</h1>
              <FollowCard user={communityDetails.createdBy} users={users} />
              <hr className="my-[10px]" />
              <h1 className="text-[25px] font-semibold my-[15px]">Members</h1>
              <MemberList member={communityDetails.members} users={users} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityBanner;
