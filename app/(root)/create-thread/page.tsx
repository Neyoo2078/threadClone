import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import CreateThread from '@/components/CreateThread';
import { fetchUser } from '@/lib/Actions/User';

const page = async () => {
  const userDatas = await currentUser();

  if (!userDatas) return null;

  const userinfo: any = await fetchUser({ userid: userDatas?.id });
  const user = JSON.parse(userinfo);
  if (!user?.onboarded) redirect('/onboarding');

  return (
    <main className="flex flex-col gap-4 w-full text-white">
      <h1 className="head-text">Create Thread</h1>
      <div className="flex flex-col  items-start w-full ">
        <CreateThread userDatas={user} />
      </div>
    </main>
  );
};

export default page;
