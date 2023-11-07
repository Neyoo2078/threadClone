'use client';
import CreateThreadHome from './CreateThreadHome';
import ThreadCard from './ThreadCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { fetchCommunityDetails } from '@/lib/Actions/community';

const forYouThread = ({ threads, user }: any) => {
  const [ActiveTab, setActiveTab] = useState({
    name: 'For You',
    id: null,
  });
  const [TabThread, setTabThread] = useState<any>([]);
  const [Reload, setReload] = useState(false);
  console.log({ Homeuser: user });
  const fetchCommunity = async () => {
    if (ActiveTab.id) {
      const res = await fetchCommunityDetails(ActiveTab.id);
      setTabThread(JSON.parse(res));
    }
  };

  useEffect(() => {
    fetchCommunity();
  }, [ActiveTab, Reload]);
  return (
    <div>
      {' '}
      <h1 className="text-[30px] font-semibold">Home</h1>
      <Tabs defaultValue="For You" className="w-full bg-black ">
        <TabsList className=" bg-black  ">
          <TabsTrigger
            value="For You"
            onClick={() => {
              setActiveTab({ name: 'For You', id: null });
            }}
          >
            For You
          </TabsTrigger>

          {user.communities.map((items: any, i: number) => (
            <TabsTrigger
              onClick={() => {
                setActiveTab({ name: items.name, id: items._id });
              }}
              key={i}
              value={items.name}
              className={`${ActiveTab.name === items.name && 'bg-[#c84040]'}`}
            >
              {items.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <hr className="my-[10px] hidden md:block" />
        <CreateThreadHome
          userDatas={user}
          communityIds={ActiveTab.id}
          setReload={setReload}
          TabThread={TabThread}
        />
        <hr className="my-[10px] hidden md:block" />
        <TabsContent value="For You">
          {threads?.post.length === 0 ? (
            <h1>no Thread avaialable</h1>
          ) : (
            <div className="flex flex-col gap-1 items-start">
              {threads?.post.map((items: any) => (
                <ThreadCard
                  post={items}
                  userid={user?._id}
                  thread={false}
                  user={user}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {user.communities.map((items: any, i: number) => (
          <TabsContent key={i} value={items.name}>
            {TabThread.length === 0 ? (
              <div>No threads Available for this Community</div>
            ) : (
              <div>
                {TabThread?.threads.map((itemss: any) => (
                  <ThreadCard
                    post={itemss}
                    userid={user?._id}
                    thread={false}
                    user={user}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default forYouThread;
