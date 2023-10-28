import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import ProfileHeader from '@/components/ProfileHeader';

const page = async () => {
  const user = await currentUser();
  const users = await fetchUser({ userid: user?.id });
  const userDetails = JSON.parse(users);

  return (
    <div>
      <ProfileHeader profile={userDetails} />
    </div>
  );
};

export default page;
