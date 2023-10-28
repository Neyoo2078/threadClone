'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

interface props {
  items: {
    word: string;
    hashtag: boolean;
    count: number;
  };
  index: number;
}

const TrendindWord = ({ items, index }: props) => {
  const route = useRouter();
  return (
    <div
      onClick={() => {
        route.push(`/explore?query=${items.word}`);
      }}
      className="flex flex-col gap-1 p-3 w-full cursor-pointer hover:bg-[#d0cece63] "
    >
      <h1 className="text-[15px]">
        <span className="mr-[2px]">{index + 1}.</span>Trending
      </h1>

      <h1 className="text-white font-[600]">{`${items?.hashtag ? '#' : ''}${
        items.word
      }`}</h1>
      <h1 className="text-[10px]">{items.count} threads</h1>
    </div>
  );
};

export default TrendindWord;
