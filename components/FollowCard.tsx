'use client';
import { AddFriend } from '@/lib/Actions/User';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
const FollowCard = ({ user, users, suggest }: any) => {
  console.log({ followUser: users });
  const router = useRouter();
  const path = usePathname();
  console.log({ path });
  const following = users?.following.includes(user._id.toString());

  const followHandler = async () => {
    await AddFriend({
      activeuser: users._id,
      seconduser: user._id,
      path: '/communities',
    });
  };

  return (
    <div>
      {' '}
      <div className="flex items-start gap-11">
        <div className="w-[140px] h-[60px]  2xl:w-[65px] 2xl:h-[60px] rounded-full">
          <img
            src={user.image}
            alt="photo"
            className="w-full h-full   rounded-full"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div
            onClick={() => {
              router.push(`/profile?user=${user._id}`);
            }}
            className={` ${suggest && 'text-[#fff]'} cursor-pointer`}
          >
            <h1 className="font-semibold">{user.name}</h1>
            <h1 className="text-[15px]">@{user.username}</h1>
          </div>
          {!suggest && <h1 className="text-[15px]">{user.bio}</h1>}
        </div>
        {users?._id !== user._id.toString() && (
          <div className="p-2 text-[15px] hover:bg-transparent hover:border-[1px] border-[white] rounded-[25px] bg-[#2fb4be] ">
            {!following ? (
              <button onClick={followHandler} className=" ">
                Follow
              </button>
            ) : (
              <button onClick={followHandler} className=" ">
                Following
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowCard;
