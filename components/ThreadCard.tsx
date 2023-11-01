'use client';
import React, { ChangeEvent } from 'react';
import Image from 'next/image';
import PhotoPicker from './PhotOPiacker';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dateFormat from 'dateformat';
import { getTimeDifference } from '@/lib/dateFormat';
import { usePathname } from 'next/navigation';
import { LikeThreads } from '@/lib/Actions/CreateThreads';
import { useState, useEffect, useRef } from 'react';
import { AiOutlineHeart } from 'react-icons/ai';
import CommentModal from './commentModal';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { GoLocation } from 'react-icons/go';
import { BsImageFill, BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineFileGif, AiOutlineSchedule } from 'react-icons/ai';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { FormSchema } from '@/lib/Validation/comment';
import GifBox from './GifBox';
import EmojiPickers from './EmojiPickers';
import { useUploadThing } from '@/lib/uploadthing';
import { isBase64Image } from '@/lib/utils';
import { ThreadComment } from '@/lib/Actions/CreateThreads';

interface props {
  post: {
    createdAt: string;
    _id: any;
    author: any;
    likes: Array<[]>;
    children: Array<[]>;
    comment: string;
    message: string;
  };
  thread: any;
  userid: any;
  user: any;
}

const ThreadCard = ({ post, thread, userid, user }: props) => {
  const datte = dateFormat(post?.createdAt, '  h:MM . d/m/yyyy');
  const inputDate = new Date(post.createdAt);
  const D = getTimeDifference(inputDate);
  console.log({ D });
  console.log({ datte });

  const router = useRouter();
  const path = usePathname();
  console.log({ users: user });
  console.log({ post });
  const HandleLike = async (e: any) => {
    e.stopPropagation();
    try {
      const res = await LikeThreads(userid, post._id, path);
    } catch (error: any) {
      throw new Error(error);
    }
  };
  const [commentOpen, setcommentOpen] = useState(false);
  const [gifOpen, setgifOpen] = useState(false);
  const [Search, setSearch] = useState(false);
  const [SearchQuery, setSearchQuery] = useState('funny');
  const [GrabPicture, setGrabPicture] = useState<boolean>(false);
  const [imageMessage, setimageMessage] = useState('');
  const [imageMessageFiles, setimageMessageFiles] = useState<File[]>([]);
  const [openEmoji, setopenEmoji] = useState(false);
  const [typeComment, settypeComment] = useState('');

  // for ModalComment
  console.log({ a: typeComment });
  console.log({ imageMessage });
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  });
  const { startUpload } = useUploadThing('media');
  async function onSubmit() {
    const hasImageChanged = isBase64Image(imageMessage);

    let pictureUrl;
    if (hasImageChanged) {
      const imgRes = await startUpload(imageMessageFiles);

      if (imgRes && imgRes[0].fileUrl) {
        pictureUrl = imgRes[0].fileUrl;
        setimageMessage(imgRes[0].fileUrl);
      }
    }

    const res = await ThreadComment(
      typeComment,
      user._id,
      post._id,
      imageMessage,
      path
    );
    setcommentOpen(false);
  }

  const closeModal = () => {
    setgifOpen(false);
  };

  //   Banner picture Change
  useEffect(() => {
    if (GrabPicture) {
      const data = document.getElementById('photo-picker') as HTMLInputElement;
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPicture(false);
        }, 1000);
      };
    }
  }, [GrabPicture]);

  const ProfilephotoPickChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setimageMessageFiles(Array.from(e.target.files));
      const data = document.createElement('img') as HTMLImageElement;
      reader.onload = function (event: any) {
        data.src = event.target.result;
        data.setAttribute('data-src', event.target.result);
      };
      reader.readAsDataURL(file);
      setTimeout(() => {
        setimageMessage(data.src);
      }, 100);
    }
  };

  return (
    <article
      className="flex w-full flex-col relative rounded-xl bg-dark-2 p-2 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        if (commentOpen) {
          return;
        }
        router.push(`/thread/${post._id}`);
      }}
    >
      <div className="flex items-start justify-between">
        <div className=" flex w-full flex-1 flex-row gap-4">
          <div
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${post.author._id}`);
            }}
            className="flex flex-col items-center"
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile?user=${post?.author?._id}`);
              }}
              className="relative h-11 w-11"
            >
              <Image
                src={post?.author?.image}
                alt="Profile-image"
                fill
                className="cursor-pointer rounded-full"
              />
            </div>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <div
              className="flex cursor-ponter justify-start items-center  gap-2"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/profile?user=${post?.author?._id}`);
              }}
            >
              <h4 className="text-base-semibold text-light-1">
                {post?.author?.name}
              </h4>
              <h4 className=" text-[12px] text-light-1">
                @{post.author.username}
              </h4>
              <h4 className=" text-[11px]  text-light-1">. {D}</h4>
            </div>
            <p className="mt-2 text-small-regular text-light-2">
              {post.message}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {thread && (
                <div className="flex flex-col gap-1">
                  <h1 className="text-[10px] text-yellow-50">{datte}</h1>
                  <hr className="border-gray-600" />
                </div>
              )}
              <div className="flex items-center gap-3.5">
                <div className="flex gap-[4px]  items-center justify-center">
                  <AiOutlineHeart
                    className={`${
                      post.likes.includes(userid) && 'text-[#a32c2c]'
                    } cursor-pointer text-[22px] object-contain hover:scale-125`}
                    title="like"
                    onClick={HandleLike}
                  />
                  {post?.likes.length > 0 && (
                    <h1 className="text-gray-1 text-[13px]">
                      {post.likes.length}
                    </h1>
                  )}
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setcommentOpen(true);
                  }}
                  className="flex gap-[2px] text-[13px] items-center justify-center"
                >
                  <Image
                    src="/assets/reply.svg"
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />

                  {!thread && (
                    <h1 className="text-gray-1">
                      {post.children.length > 0 && post.children.length}
                    </h1>
                  )}
                </div>

                <Image
                  src="/assets/repost.svg"
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {post.comment && post.comment.length > 0 && (
                <Link href={`/thread/${post._id}`}>
                  <p className="mt-2 text-subtle-medium text-gray-1">
                    {post.comment.length} reply
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {commentOpen && (
        <div className="fixed bg-white/20   flex   bg-black inset-0 z-50">
          <div
            className={`w-[600px] flex flex-col gap-0 mx-auto ${
              imageMessage ? 'max-h-[600px] overflow-y-scroll' : 'max-h-[500px]'
            } relative mt-[50px] rounded-[20px]  bg-white`}
          >
            <div
              className={`flex absolute  z-50 $ ${
                imageMessage ? '-bottom-7' : 'bottom-0'
              } p-2 bg-white justify-between w-full `}
            >
              <div className="w-full  flex justify-start gap-2 ">
                <div className="rounded-full p-2 hover:bg-primary-500 ">
                  <BsImageFill
                    onClick={(e) => {
                      if (imageMessage || openEmoji) {
                        return;
                      }
                      e.stopPropagation();
                      setGrabPicture(true);
                      console.log(GrabPicture);
                    }}
                    className="w-[20px] h-[20px]  text-primary-500 hover:text-white  cursor-pointer"
                  />
                </div>
                <div className="rounded-full p-2 hover:bg-primary-500 ">
                  <BsEmojiSmile
                    onClick={() => {
                      setopenEmoji(true);
                    }}
                    className="w-[20px] h-[20px]  text-primary-500 font-[300] hover:text-white  cursor-pointer"
                  />
                </div>
                <div className="rounded-full p-2 hover:bg-primary-500 ">
                  <AiOutlineFileGif
                    onClick={() => {
                      if (imageMessage || openEmoji) {
                        return;
                      }
                      setgifOpen(true);
                    }}
                    className="w-[20px] h-[20px]  text-primary-500 hover:text-white  cursor-pointer"
                  />
                </div>{' '}
                <div className="rounded-full p-2 hover:bg-primary-500 ">
                  <AiOutlineSchedule className="w-[20px] h-[20px] text-primary-500 hover:text-white   cursor-pointer" />
                </div>
                <div className="rounded-full p-2 hover:bg-primary-500 ">
                  <GoLocation className="w-[20px] h-[20px]  text-primary-500 hover:text-white  cursor-pointer" />{' '}
                </div>
              </div>
              <button
                disabled={typeComment.length === 0}
                onClick={onSubmit}
                className="rounded-[20px] bg-primary-500 text-white py-1 px-2"
              >
                Reply
              </button>
            </div>
            <div
              className={`flex ${gifOpen ? 'hidden' : 'sticky top-0 z-50'}   ${
                imageMessage && 'bg-slate-400/95'
              }  justify-between w-full p-3 `}
            >
              <AiOutlineClose
                onClick={(e) => {
                  e.stopPropagation();
                  setcommentOpen(false);
                  setimageMessage('');
                }}
                className="text-black w-[20px] h-[20px] "
              />
              <button className="text-black">Draft</button>
            </div>
            <div className="flex gap-2 items-start w-full p-3">
              <div className="flex flex-col gap-1 items-center justify-center ">
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
                  <p className="text-[#0f1419] font-[500]">
                    {post.author.name}
                  </p>
                  <p className="text-[#828586] font-[200]">
                    @{post.author.username}
                  </p>
                  <p className="text-[#828586] font-[200] ">
                    {dateFormat(post.createdAt, ' mmmm d ')}
                  </p>
                </div>
                <div className="min-h-[59px] flex items-start">
                  <p className="text-[#0f1419] font-[500]">{post.message}</p>
                </div>

                <p className="text-[#7c7d7d] font-[500] mt-3">
                  Replying to @{post.author.username}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-2  h-[128px] p-5 ">
              <div className="flex gap-2 w-full">
                <Link
                  href={`/profile/${user._id}`}
                  className="relative h-11 w-11  "
                >
                  <Image
                    src={user.image}
                    alt="Profile-image"
                    width={44}
                    height={44}
                    className="cursor-pointer rounded-full"
                  />
                </Link>
                <div className="flex flex-grow flex-col gap-2">
                  <Form {...form}>
                    <form className="w-[512px]">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl className=" textA  border-none outline-none focus:outline-none">
                              <Textarea
                                placeholder="Post your Reply"
                                className=" resize-none w-full outline-none   text-black"
                                value={typeComment}
                                onChange={(e) => {
                                  settypeComment(e.target.value);
                                }}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                  {imageMessage && (
                    <div className="w-[512px] h-[300px]">
                      <img
                        src={imageMessage}
                        alt="msg"
                        className="w-full h-[300px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {openEmoji && (
              <EmojiPickers
                openEmoji={openEmoji}
                setopenEmoji={setopenEmoji}
                addToComment={settypeComment}
              />
            )}
          </div>
          {GrabPicture && <PhotoPicker change={ProfilephotoPickChange} />}
          {gifOpen && (
            <GifBox closeModal={closeModal} setimageMessage={setimageMessage} />
          )}
        </div>
      )}
    </article>
  );
};

export default ThreadCard;
