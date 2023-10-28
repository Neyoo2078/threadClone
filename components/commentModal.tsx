'use client';
import { AiOutlineClose } from 'react-icons/ai';
import Image from 'next/image';
import Link from 'next/link';
import dateFormat from 'dateformat';
import { useState } from 'react';

interface props {
  post: {
    message: string;
    author: {
      _id: string;
      image: string;
      username: string;
      name: string;
    };
    createdAt: string;
  };
  user: any;
}
const commentModal = ({ post, user }: props) => {
  console.log({ post });
  console.log({ user });

  return (
    <div className="fixed bg-white/20 flex  w-full h-full bg-black inset-0 z-50">
      <div className="w-[600px] flex flex-col h-[400px] rounded-[20px]  bg-white">
        <div className="flex justify-between w-full p-5 ">
          <AiOutlineClose className="text-black w-[20px] h-[20px] " />
          <button className="text-black">Draft</button>
        </div>
        <div className="flex gap-5 items-start w-full p-5">
          <div className="flex flex-col gap-2 items-center justify-center ">
            {' '}
            <Link
              href={`/profile/${post?.author?._id}`}
              className="relative h-11 w-11  "
            >
              <Image
                src={post?.author?.image}
                alt="Profile-image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="h-[100px] border-[2px] border-[rgb(207, 217, 222)]"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3">
              <p className="text-[#0f1419] font-[500]">{post.author.name}</p>
              <p className="text-[#828586] font-[200]">
                @{post.author.username}
              </p>
              <p className="text-[#828586] font-[200] ">
                {dateFormat(post.createdAt, ' mmmm d ')}
              </p>
            </div>
            <p className="text-[#0f1419] font-[500]">{post.message}</p>
            <p className="text-[#0f1419] font-[500]">
              Replying to @{post.author.username}
            </p>
          </div>
        </div>
        <div>
          <Link href={`/profile/${user._id}`} className="relative h-11 w-11  ">
            <Image
              src={user.image}
              alt="Profile-image"
              fill
              className="cursor-pointer rounded-full"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default commentModal;
