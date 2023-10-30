import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { fetchTreads } from '@/lib/Actions/CreateThreads';
import ThreadCard from '@/components/ThreadCard';
import { currentUser } from '@clerk/nextjs';
import { useOrganization } from '@clerk/nextjs';
import CreateThreadHome from '@/components/CreateThreadHome';
import { fetchUser } from '@/lib/Actions/User';

export default async function Home() {
  const thre = await fetchTreads();
  const threads = JSON.parse(thre);

  const userDatas = await currentUser();

  if (!userDatas) return null;

  const userinfo: any = await fetchUser({ userid: userDatas?.id });
  const user = JSON.parse(userinfo);

  return (
    <main className="text-white">
      <h1 className="text-[40px] font-semibold">Home</h1>
      <hr className="my-[10px]" />
      <CreateThreadHome userDatas={user} />
      <hr className="my-[10px]" />
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
    </main>
  );
}
