'use client';
import Image from 'next/image';
import { AiFillCamera, AiOutlineClose } from 'react-icons/ai';
import ProfileTabs from './ProfileTabs';
import { useState, useEffect } from 'react';
import ProfileModal from './ProfileModal';

interface props {
  profile: {
    image: string;
    name: string;
    username: string;
    bio: string;
    threads: Array<[]>;
  };
}

const ProfileHeader = ({ profile }: props) => {
  const [openModal, setopenModal] = useState(false);
  console.log(openModal);

  return (
    <div className="flex flex-col z-20 overflow-hidden">
      {openModal && (
        <ProfileModal setopenModal={setopenModal} profile={profile} />
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
        <button
          onClick={() => {
            setopenModal(true);
          }}
          className="text-black p-2 rounded-full mt-5 font-semibold bg-white"
        >
          Edit profile
        </button>
      </div>
      <div className="flex  text-white flex-col w-full flex-start">
        <h1 className=" text-[25px]">{profile.name}</h1>
        <h1 className="">@{profile.username}</h1>
        <p className="mt-[10px]">{profile.bio}</p>
      </div>
      <ProfileTabs threads={profile?.threads} user={profile} />
    </div>
  );
};

export default ProfileHeader;
