'use client';

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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreadValidation } from '@/lib/Validation/thread';
import { Input } from '@/components/ui/input';
import { useRef, useEffect, useState } from 'react';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import { useRouter, usePathname } from 'next/navigation';
import { postThread } from '@/lib/Actions/CreateThreads';
import * as z from 'zod';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';

const MobileCreateThread = ({
  userDatas,
  setopenMobileModal,
  openMobileModal,
}: any) => {
  const pathname = usePathname();
  const router = useRouter();
  const [openImageMessage, setopenImageMessage] = useState(false);
  const [imageMessageFiles, setimageMessageFiles] = useState<File[]>([]);
  const [imageMessage, setimageMessage] = useState('');
  const [openEmoji, setopenEmoji] = useState(false);
  const [closeModal, setcloseModal] = useState(false);
  const [inputValue, setinputValue] = useState('');
  const [CommOption, setCommOption] = useState({ name: 'everyone', id: null });
  const [openMenu, setopenMenu] = useState(false);

  const inpu: React.Ref<HTMLInputElement> | null = useRef(null);
  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      message: '',
      accountid: userDatas._id,
    },
  });
  useEffect(() => {
    inpu?.current?.focus();
  }, []);

  const divRef: React.RefObject<HTMLDivElement> | null = useRef(null);
  const DivHeight = 120;

  const { startUpload } = useUploadThing('media');

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    console.log({ V: values.message });
    // const hasImageChanged = isBase64Image(imageMessage);
    // let pictureUrl = '';
    // if (hasImageChanged) {
    //   const imgRes = await startUpload(imageMessageFiles);
    //   if (imgRes && imgRes[0].fileUrl) {
    //     pictureUrl = imgRes[0].fileUrl;
    //     setimageMessage(imgRes[0].fileUrl);
    //   }
    // }
    await postThread({
      message: values?.message,
      author: values?.accountid,
      // pictureMessage: pictureUrl,
      path: pathname,
      communityId: CommOption.id ? CommOption.id : null,
    });
    form.reset();
    setopenMobileModal(false);
  };
  return (
    <div className="flex flex-col  gap-5 w-full h-full fixed z-40 inset-0 p-5 bg-black">
      <div className="">
        <div className="flex justify-between items-center text-white">
          <h1
            onClick={() => {
              setopenMobileModal(false);
            }}
          >
            Cancel
          </h1>
          <div className="flex gap-3 items-center text-white">
            <h1>Draft</h1>
            <button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-primary-500 px-3 py-2 rounded-full"
            >
              Create
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-start">
        <Image
          src={userDatas?.image}
          alt="profile_photo"
          width={96}
          height={96}
          className="rounded-full  w-[50px] h-[50px] "
        />
        <div>
          <div
            onClick={() => {
              setopenMenu(!openMenu);
            }}
            style={{
              position: 'relative',
              border: '1px solid #0000FF',
              borderRadius: '50px',
              cursor: 'pointer',
              width: '120px',
            }}
          >
            <div className="flex gap-2 p-2 items-center justify-center">
              <h1>{CommOption.name}</h1>
              {openMenu ? <IoIosArrowDown /> : <IoIosArrowForward />}
            </div>
            {openMenu && (
              <div
                ref={divRef}
                style={{
                  position: 'absolute',
                  backgroundColor: '#fff',
                  color: '#000',
                  padding: '5px',
                  width: '100px',
                  borderRadius: '5px',
                  marginTop: '10px',
                  opacity: '0.9',
                }}
              >
                <h1
                  onClick={() => {
                    setCommOption({ name: 'everyone', id: null });
                  }}
                  className="p-1 hover:bg-primary-500 cursor-pointer"
                >
                  everyone
                </h1>
                {userDatas.communities.map((items: any, i: number) => (
                  <h1
                    onClick={() => {
                      setCommOption({ name: items.name, id: items._id });
                    }}
                    className="p-1 hover:bg-primary-500"
                    key={i}
                  >
                    {items.name}
                  </h1>
                ))}
              </div>
            )}
          </div>

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
                        ref={inpu}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default MobileCreateThread;
