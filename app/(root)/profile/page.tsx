import { currentUser } from '@clerk/nextjs';
import { fetchUser } from '@/lib/Actions/User';
import ProfileHeader from '@/components/ProfileHeader';
import { fetchUserBySearch } from '@/lib/Actions/User';

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const user = await currentUser();
  const users = await fetchUser({ userid: user?.id });
  const searchUser = await fetchUserBySearch({ userid: searchParams.user });

  const userDetails = !searchParams.user
    ? JSON.parse(users)
    : JSON.parse(searchUser);

  return (
    <div>
      <ProfileHeader
        profile={userDetails}
        users={JSON.parse(users)}
        use={user}
      />
    </div>
  );
};

export default page;
