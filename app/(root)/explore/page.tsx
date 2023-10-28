import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from '@/components/Search';
import TopTab from '@/components/TopTab';
import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import LatestTab from '@/components/LatestTab';
import PeopleTab from '@/components/PeopleTab';
const page = async ({ searchParams }: any) => {
  const user = await currentUser();
  const Duser = await fetchUser({ userid: user?.id });
  const users = JSON.parse(Duser);
  return (
    <div className="text-white ">
      <Search value={searchParams?.query} />
      <Tabs defaultValue="top" className="w-full mt-6 text-white">
        <TabsList className="w-full flex justify-between px-2">
          <TabsTrigger value="top">Top</TabsTrigger>
          <TabsTrigger value="latest">Latest</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="list">List</TabsTrigger>
        </TabsList>
        <TabsContent value="top">
          <TopTab value={searchParams?.query} currentusers={users} />
        </TabsContent>
        <TabsContent value="latest">
          <LatestTab value={searchParams?.query} currentusers={users} />
        </TabsContent>
        <TabsContent value="people">
          <PeopleTab value={searchParams?.query} currentusers={users} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
