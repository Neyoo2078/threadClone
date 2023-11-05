import React from 'react';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import SuggestedUsers from './SuggestedUsers';
import { fetchTrendingWords } from '@/lib/Actions/CreateThreads';
import TrendindWord from './TrendindWord';

const RightSideBar = async () => {
  type TrendingWord = {
    word: string;
    count: number;
    hashtag: boolean;
    // Add more properties as needed
  };
  const user = await currentUser();
  const users = await fetchUser({ userid: user?.id });
  const newUser = JSON.parse(users);
  const trendingWords = await fetchTrendingWords();
  const trends: TrendingWord[] = JSON.parse(trendingWords);

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col gap-3 justify-start">
        <div className="bg-[#3c3b3b7c] p-3 rounded-md">
          <h1 className="text-[20px] font-bold text-white">
            Trending Topics For you
          </h1>
          <div className="text-white flex flex-col">
            {trends.slice(0, 5).map((items, i) => (
              <TrendindWord items={items} index={i} key={i} />
            ))}
          </div>
        </div>
        <SuggestedUsers userid={newUser?._id} user={newUser} />
      </div>
    </section>
  );
};

export default RightSideBar;
