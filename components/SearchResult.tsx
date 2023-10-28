'use client';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const SearchResult = ({ result }: any) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/profile');
  };
  return (
    <div
      className="py-[10px] cursor-pointer flex items-center gap-2 px-[20px] hover:bg-[#efefef]"
      onClick={handleClick}
    >
      <Image
        src={result.image}
        alt="profile_photo"
        width={40}
        height={40}
        className="rounded-full"
      />
      <div className="flex flex-col ">
        <h1 className="font-bold  text-black">{result.name}</h1>
        <h1 className="text-[#7d7d7d]">@{result.username}</h1>
      </div>
    </div>
  );
};

export default SearchResult;
