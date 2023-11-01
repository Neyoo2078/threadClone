'use client';
import Image from 'next/image';
import { AiFillCamera, AiOutlineClose } from 'react-icons/ai';
import ProfileTabs from './ProfileTabs';
import { useState, useEffect } from 'react';
import ProfileModal from './ProfileModal';
import { AddFriend } from '@/lib/Actions/User';
import { usePathname } from 'next/navigation';
import dateFormat from 'dateformat';
import { BiCalendar } from 'react-icons/bi';
interface props {
  profile: {
    image: string;
    name: string;
    username: string;
    bio: string;
    threads: Array<[]>;
    _id: string;
    followers: Array<[]>;
    createdAt: string;
    following: Array<[]>;
  };
  users: any;
  use: any;
}

const ProfileHeader = ({ profile, users, use }: props) => {
  const [openModal, setopenModal] = useState(false);
  console.log(openModal);
  const path = usePathname();
  console.log({ path });
  const handleAddFriend = async () => {
    await AddFriend({ activeuser: users._id, seconduser: profile._id, path });
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col z-20 overflow-hidden">
      {openModal && (
        <ProfileModal setopenModal={setopenModal} users={users} use={use} />
      )}
      <div className="flex flex-col items-end w-full">
        <div
          style={{
            backgroundImage: `url('/assets/bg_profile.jpg')`,
            backgroundSize: 'cover',
          }}
          className={`relative w-full h-[200px]  rounded-md bg-cover`}
        >
          <div className="absolute w-[120px] h-[120px] rounded-full left-4 bottom-[-30px] bg-white ">
            <Image
              src={profile.image}
              fill
              alt="profile_picture"
              className="rounded-full"
            />
          </div>
        </div>
        {users._id === profile._id && (
          <button
            onClick={() => {
              setopenModal(true);
            }}
            className="text-black p-2 rounded-full mt-5 font-semibold bg-white"
          >
            Edit profile
          </button>
        )}
        {users._id !== profile._id && (
          <div>
            {' '}
            <button
              onClick={handleAddFriend}
              className="text-black p-2 rounded-full mt-5 font-semibold bg-white"
            >
              {profile.followers.includes(users._id)
                ? 'following'
                : 'Add friend'}
            </button>
          </div>
        )}
      </div>
      <div
        className={`flex  text-white flex-col gap-1 mt-[10px] w-full flex-start`}
      >
        <div className="flex gap-1 items-center ">
          <h1 className=" text-[20px]">{profile.name}</h1>
          <h1 className="">@{profile.username}</h1>
        </div>
        <p className="mt-[10px] text-[15px]">{profile.bio}</p>
        <div className="flex gap-1">
          {' '}
          <BiCalendar />
          <h1 className="text-[12px]">
            {' '}
            Joined {dateFormat(profile.createdAt, ' mmmm dS, yyyy,')}
          </h1>
        </div>
        <div className="flex gap-2 text-[12px] ">
          <h1> following {profile.following.length}</h1>
          <h1> followers {profile.followers.length}</h1>
        </div>
      </div>
      <ProfileTabs threads={profile?.threads} user={profile} />
    </div>
  );
};

export default ProfileHeader;
