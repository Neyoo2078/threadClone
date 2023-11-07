'use client';
import * as z from 'zod';
import { ChangeEvent } from 'react';
import { tweets } from '@/lib/data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreadValidation } from '@/lib/Validation/thread';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { BsImageFill, BsEmojiSmile } from 'react-icons/bs';
import { AiOutlineFileGif, AiOutlineSchedule } from 'react-icons/ai';
import { GoLocation } from 'react-icons/go';
import { useRouter, usePathname } from 'next/navigation';
import { postThread } from '@/lib/Actions/CreateThreads';
import { flagedWords } from '@/lib/data';
import { wordorPhrase, trendingWordByHashtag, hashtag } from '@/lib/utils';
import PhotoPicker from '@/components/PhotOPiacker';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import EmojiPickers2 from './EmojiPicker2';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { useOrganization } from '@clerk/nextjs';
import { BsPencil } from 'react-icons/bs';
import MobileCreateThread from './MobileCreateThread';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import Image from 'next/image';
import EmojiPicker from 'emoji-picker-react';
import GifBox from './GifBox';

interface props {
  userDatas: any;
  communityIds: any;
  setReload: any;
  TabThread: any;
}

interface params {
  message: any;
  accountid: any;
  path: any;
  communityIds: any;
  TabThread: any;
}
const CreateThreadHome = ({
  userDatas,
  communityIds,
  setReload,
  TabThread,
}: props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openImageMessage, setopenImageMessage] = useState(false);
  const [imageMessageFiles, setimageMessageFiles] = useState<File[]>([]);
  const [imageMessage, setimageMessage] = useState('');
  const [openEmoji, setopenEmoji] = useState(false);
  const [closeModal, setcloseModal] = useState(false);
  const [inputValue, setinputValue] = useState('');
  const [openMobileModal, setopenMobileModal] = useState(false);

  const userOrganization = useOrganization();
  console.log({ userOrganization });

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      message: '',
      accountid: userDatas?._id,
    },
  });
  const { startUpload } = useUploadThing('media');

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    const hasImageChanged = isBase64Image(imageMessage);

    let pictureUrl = '';
    if (hasImageChanged) {
      const imgRes = await startUpload(imageMessageFiles);

      if (imgRes && imgRes[0].fileUrl) {
        pictureUrl = imgRes[0].fileUrl;
        setimageMessage(imgRes[0].fileUrl);
      }
    }
    await postThread({
      message: values?.message,
      author: values?.accountid,
      // pictureMessage: pictureUrl,
      path: pathname,
      communityId: communityIds ? communityIds : null,
    });
    form.reset();
    setReload(true);
  };
  useEffect(() => {
    if (openImageMessage) {
      const data = document.getElementById('photo-picker') as HTMLInputElement;
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setopenImageMessage(false);
        }, 1000);
      };
    }
  }, [openImageMessage]);
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
  const modalClose = () => {
    setcloseModal(false);
  };

  const handleChange = (e: any) => {
    setinputValue(e.target.value);
  };

  return (
    <div className="flex relative flex-col gap-1  ">
      {closeModal && (
        <div className="fixed inset-0 z-40 bg-white/10 flex w-full h-full  ">
          <GifBox closeModal={modalClose} setimageMessage={setimageMessage} />
        </div>
      )}
      <div
        onClick={() => {
          setopenMobileModal(true);
        }}
        className="fixed z-40 md:hidden bg-primary-500 p-3  rounded-full bottom-[90px] right-[40px] "
      >
        <BsPencil className="" />
      </div>
      {openMobileModal && (
        <MobileCreateThread
          userDatas={userDatas}
          setopenMobileModal={setopenMobileModal}
          openMobileModal={openMobileModal}
        />
      )}
      <div className=" gap-1 relative md:block hidden items-start justify-between">
        <Image
          src={userDatas?.image}
          alt="profile_photo"
          width={96}
          height={96}
          className="rounded-full object-contain w-[50px] h-[50px] md:w-[96px] md:h-[96px]"
        />
        <div
          className={`flex flex-col ${
            imageMessage && 'h-[260px] md:h-[330px]'
          } justify-between  gap-1 w-[80%]`}
        >
          <Form {...form}>
            <form className="flex w-full gap-10 flex-col  pb-3 justify-start">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex  flex-col  items-start gap-4">
                    <FormControl className="flex-1 my-[10px] text-base-semibold text-gray-200">
                      <Input
                        placeholder="What is happening?!"
                        className="account-form_input no-focus outline-none w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          {imageMessage && (
            <div className="absolute top-[60px]">
              <div className="relative w-[200px] h-[100px] lg:w-[400px]  lg:h-[200]">
                <div className="w-[30px] flex justify-center items-center h-[30px] cursor-pointer  absolute top-3 right-2 bg-black rounded-full">
                  <AiOutlineClose
                    onClick={(e) => {
                      e.stopPropagation();
                      setimageMessage('');
                    }}
                    className="text-white   w-[20px] h-[20px] "
                  />
                </div>
                <img
                  src={imageMessage}
                  alt="img-message"
                  className="my-3 w-[200px] h-[130px] lg:w-[400px] lg:h-[200px]"
                />
              </div>
            </div>
          )}
          <div className="flex  w-full my-[2px] border-t-[1px] py-2  justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="rounded-full p-2 hover:bg-primary-500 ">
                <BsImageFill
                  onClick={() => {
                    if (imageMessage) {
                      return;
                    }
                    setopenImageMessage(true);
                  }}
                  className="w-[20px] h-[20px]  cursor-pointer"
                />
              </div>
              <div
                onClick={() => {
                  setopenEmoji(true);
                }}
                className="rounded-full hidden lg:block p-2 hover:bg-primary-500 "
              >
                <BsEmojiSmile className="w-[20px] h-[20px]  cursor-pointer" />
              </div>
              <div
                onClick={() => {
                  if (imageMessage) {
                    return;
                  }
                  setcloseModal(true);
                }}
                className="rounded-full p-2 hover:bg-primary-500 "
              >
                <AiOutlineFileGif className="w-[20px] h-[20px]  cursor-pointer" />
              </div>{' '}
              <div className="rounded-full p-2 hover:bg-primary-500 ">
                <AiOutlineSchedule className="w-[20px] h-[20px]  cursor-pointer" />
              </div>
              <div className="rounded-full p-2 hover:bg-primary-500 ">
                <GoLocation className="w-[20px] h-[20px]  cursor-pointer" />{' '}
              </div>
            </div>
            <button
              className="bg-primary-500 text-[18px] font-semibold py-1 px-3 rounded-2xl"
              type="button"
              onClick={form.handleSubmit(onSubmit)}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {openImageMessage && <PhotoPicker change={handleImageChange} />}
      {openEmoji && (
        <div
          className={` w-[300px] h-[400px] rounded-[10px] border-none pb-4 shadow-sm shadow-[#fff] bg-white absolute ${
            !imageMessage ? 'bottom-1' : 'top-[42px]'
          } z-50`}
        >
          <div
            className={` ${
              imageMessage ? 'author-content2' : 'author-content'
            }  h-[400px] w-[300px] pb-4 border-none`}
          >
            <EmojiPickers2
              setopenEmoji={setopenEmoji}
              addToComment={setinputValue}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateThreadHome;
