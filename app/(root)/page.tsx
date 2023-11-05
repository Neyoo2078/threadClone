import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import { fetchTreads } from '@/lib/Actions/CreateThreads';
import ThreadCard from '@/components/ThreadCard';
import { currentUser } from '@clerk/nextjs';
import { useOrganization } from '@clerk/nextjs';
import CreateThreadHome from '@/components/CreateThreadHome';
import { fetchUser } from '@/lib/Actions/User';
import { redirect } from 'next/navigation';
import ForYouThread from '@/components/ForYouThread';

export default async function Home() {
  const thre = await fetchTreads();
  const threads = JSON.parse(thre);

  const userDatas = await currentUser();

  if (!userDatas) return null;

  const userinfo: any = await fetchUser({ userid: userDatas?.id });
  const user = JSON.parse(userinfo);
  if (!user) {
    redirect('/onboarding');
  }

  return (
    <main className="text-white">
      <ForYouThread threads={threads} user={user} />
    </main>
  );
}
