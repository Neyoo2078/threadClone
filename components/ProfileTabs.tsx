'use client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@radix-ui/react-tabs';
import { profileTabs } from '@/constants';
import { useState, useEffect } from 'react';
import { array } from 'zod';
import ThreadCard from './ThreadCard';
import ReplyTab from './ReplyTab';
import LikeTab from './LikeTab';

interface props {
  threads: any;
  user: any;
}

const ProfileTabs = ({ threads, user }: props) => {
  console.log({ profileUser: user });
  const [posts, setposts] = useState<null | []>(null);
  useEffect(() => {
    setposts(threads);
  }, [threads]);

  const [activeTab, setActiveTab] = useState('threads');
  return (
    <div className="w-full mt-7 text-white">
      <Tabs defaultValue="threads" className="w-full m-auto">
        <TabsList className="w-[96%] flex justify-between m-3 text-black">
          {profileTabs.map((tabs, i) => (
            <TabsTrigger
              key={i}
              value={tabs.value}
              onClick={() => {
                setActiveTab(tabs.value);
              }}
              className={`hover:bg-primary-500 ${
                activeTab === tabs.value && 'border-primary-500 border'
              } text-white p-3`}
            >
              {tabs.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="threads" className="flex flex-col gap-2">
          {posts?.map((post, i) => (
            <ThreadCard
              post={post}
              key={i}
              thread={false}
              userid={user._id}
              user={user}
            />
          ))}
        </TabsContent>
        <TabsContent value="Replies">
          <ReplyTab user={user} />
        </TabsContent>
        <TabsContent value="likes">
          <LikeTab user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
