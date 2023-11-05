'use client';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useRouter } from 'next/navigation';

const CommunityCard = ({ items }: any) => {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push(`/communities/${items._id}`);
      }}
      className="flex items-start gap-3 border-[#f1eeee44] rounded-sm border-[1px] cursor-pointer p-3 hover:bg-[#ffffff13]"
    >
      <div className=" flex justify-center  rounded-md w-[130px] h-[130px]">
        <img src={items.image} alt="photo" />
      </div>

      <div className="flex justify-start items-start flex-col gap-10">
        <div>
          <h1 className="text-[18px] font-semibold">{items.name}</h1>
          <h1 className="text-[12px] ">
            {items.members.length}{' '}
            {items.members.length === 1 ? 'Member' : 'Members'}
          </h1>
        </div>

        <AvatarGroup max={4}>
          {items.members.map((items: any, i: number) => (
            <Avatar
              sx={{ width: 30, height: 30 }}
              key={i}
              alt="Remy Sharp"
              src={items.image}
            />
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
};

export default CommunityCard;
