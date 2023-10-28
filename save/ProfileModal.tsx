'use client';
import * as z from 'zod';
import { AiFillCamera, AiOutlineClose } from 'react-icons/ai';
import { TbCameraPlus } from 'react-icons/tb';
import Image from 'next/image';
import { updateUserData } from '../lib/Actions/User';
import { useState, useEffect } from 'react';
import { ChangeEvent } from 'react';
import PhotoPicker from './PhotOPiacker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileEditValidation } from '@/lib/Validation/profileEdit';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useUploadThing } from '@/lib/uploadthing';
import { useRouter, usePathname } from 'next/navigation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { isBase64Image } from '@/lib/utils';

import UserUpdate from '../lib/Actions/User';

const ProfileModal = ({ setopenModal, profile, user }: any) => {
  const [GrabPhoto, setGrabPhoto] = useState(false);
  const [GrabProfilePhoto, setGrabProfilePhoto] = useState(false);
  const [image, setimage] = useState('/assets/bg_profile.jpg');
  const [Profileimage, setProfileimage] = useState(profile.image);
  const [ProfileFiles, setProfileFiles] = useState<File[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  //   Banner picture Change
  useEffect(() => {
    if (GrabPhoto) {
      const data = document.getElementById('photo-picker') as HTMLInputElement;
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [GrabPhoto]);

  useEffect(() => {
    if (GrabProfilePhoto) {
      const data = document.getElementById('photo-picker') as HTMLInputElement;
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabProfilePhoto(false);
        }, 1000);
      };
    }
  }, [GrabProfilePhoto]);

  const { startUpload } = useUploadThing('media');

  const photoPickChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const data = document.createElement('img') as HTMLImageElement;
      reader.onload = function (event: any) {
        data.src = event.target.result;
        data.setAttribute('data-src', event.target.result);
      };
      reader.readAsDataURL(file);
      setTimeout(() => {
        setimage(data.src);
      }, 100);
    }
  };

  const ProfilephotoPickChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setProfileFiles(Array.from(e.target.files));
      const data = document.createElement('img') as HTMLImageElement;
      reader.onload = function (event: any) {
        data.src = event.target.result;
        data.setAttribute('data-src', event.target.result);
      };
      reader.readAsDataURL(file);
      setTimeout(() => {
        setProfileimage(data.src);
      }, 100);
    }
  };

  //   Banner Picture Close

  const form = useForm({
    resolver: zodResolver(ProfileEditValidation),
    defaultValues: {
      name: profile.name || '',
      username: profile?.username || '',
      bio: profile?.bio || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileEditValidation>) => {
    const hasImageChanged = isBase64Image(Profileimage);

    if (hasImageChanged) {
      const imgRes = await startUpload(ProfileFiles);

      if (imgRes && imgRes[0].fileUrl) {
        const profilepictureUrl = imgRes[0].fileUrl;
        setProfileimage(imgRes[0].fileUrl);
      }
    }

    console.log({
      userid: user.id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      image: Profileimage,
      banner: image,
    });

    await updateUserData({
      userid: user.id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      image: Profileimage,
      banner: image,
    });

    router.push('/');
  };

  return (
    <div className="bg-white/20 w-full h-full flex  items-center fixed z-50 overflow-auto inset-0 text-white">
      {GrabPhoto && <PhotoPicker change={photoPickChange} />}
      {GrabProfilePhoto && <PhotoPicker change={ProfilephotoPickChange} />}
      <div className="bg-white rounded-lg px-3 gap-4 relative   text-black flex flex-col overflow-y-scroll  w-[80%] sm:w-[50%] h-[600px] opacity-100 m-auto">
        <div className="flex sticky p-2 bg-white z-50 top-0 justify-between">
          <div className="flex gap-4 items-center ">
            <AiOutlineClose
              onClick={() => {
                setopenModal(false);
              }}
              className="w-[25px] h-[25px]"
            />
            <p className="font-bold text-[20px]">Edit Profile</p>
          </div>
          <button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-black text-white py-2 px-6 rounded-lg"
          >
            Save
          </button>
        </div>
        {/* banner */}
        <div
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
          }}
          className={`relative w-full min-h-[200px]  rounded-md bg-cover`}
        >
          <div
            style={{
              backgroundImage: `url(${Profileimage})`,
              backgroundSize: 'cover',
            }}
            className="absolute w-[120px] h-[120px] border-[2px] flex  justify-center items-center border-white rounded-full left-4 bottom-[-30px] bg-white "
          >
            <div className="bg-black/30 cursor-pointer hover:bg-black/50 p-3 rounded-full ">
              <TbCameraPlus
                style={{
                  color: 'white',
                  width: '30px',
                  height: '30px',
                }}
                onClick={() => {
                  setGrabProfilePhoto(true);
                }}
              />
            </div>
          </div>
          <div className=" bg-[#e7e2e2] w-[40px] absolute right-2 top-2 h-[40px] flex items-center rounded-full">
            <AiFillCamera
              onClick={() => {
                setGrabPhoto(true);
              }}
              style={{
                color: 'black',
                width: '80px',
                height: '80px',
                margin: '5px',
              }}
            />
          </div>
        </div>

        {/* form */}
        <div>
          <Form {...form}>
            <form className="flex gap-4 flex-col m-6  justify-start">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex  flex-col  items-start gap-2">
                    <FormLabel className="text-base-semibold w-[15%] text-black">
                      Name
                    </FormLabel>
                    <FormControl className="flex-1  text-base-semibold text-dark-2">
                      <Input
                        placeholder="Name"
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex  flex-col  items-start gap-2">
                    <FormLabel className="text-base-semibold w-[15%] text-black">
                      UserName
                    </FormLabel>
                    <FormControl className="flex-1  text-base-semibold text-dark-2">
                      <Input
                        placeholder="User Name"
                        className="bg-white on-focus"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="flex flex-col  items-start  gap-2">
                    <FormLabel className="text-base-semibold w-[15%] text-black">
                      Bio
                    </FormLabel>
                    <FormControl className="flex-1  text-base-semibold text-dark-2">
                      <Textarea
                        placeholder="Bio"
                        rows={5}
                        className="bg-white on-focus"
                        {...field}
                      />
                    </FormControl>
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

export default ProfileModal;
