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
}

interface params {
  message: any;
  accountid: any;
  path: any;
  communityId: any;
}
const CreateThreadHome = ({ userDatas }: props) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openImageMessage, setopenImageMessage] = useState(false);
  const [imageMessageFiles, setimageMessageFiles] = useState<File[]>([]);
  const [imageMessage, setimageMessage] = useState('');
  const [openEmoji, setopenEmoji] = useState(false);
  const [closeModal, setcloseModal] = useState(false);
  const [inputValue, setinputValue] = useState('');

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
      communityId: null,
    });
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
    <div className="flex flex-col gap-1  ">
      {closeModal && (
        <div className="fixed inset-0 z-40 bg-white/10 flex w-full h-full  ">
          <GifBox closeModal={modalClose} setimageMessage={setimageMessage} />
        </div>
      )}
      <div className="flex gap-1  items-start justify-between">
        <Image
          src={userDatas?.image}
          alt="profile_photo"
          width={96}
          height={96}
          className="rounded-full object-contain"
        />
        <div className="flex flex-col w-[80%]">
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
                        className="account-form_input no-focus outline-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            {imageMessage && (
              <div className="relative w-[400px]  h-[200]">
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
                  className="my-3 w-[400px] h-[200px]"
                />
              </div>
            )}
          </Form>
          <div className="flex  w-full my-[5px] border-t-[1px] py-2  justify-between items-center">
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
                className="rounded-full p-2 hover:bg-primary-500 "
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
