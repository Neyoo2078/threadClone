'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserValidation } from '@/lib/Validation/user';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
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
import Image from 'next/image';
import { ChangeEvent } from 'react';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';
import UserUpdate from '../lib/Actions/User';

interface props {
  userDatas: any;
  // {
  //     id: string;
  //     objectId: string;
  //     username: string;
  //     firstName: string;
  //     bio: string;
  //     imageUrl: string;
  //   };
  btnTitle: string;
}
const AccountProfile = ({ userDatas, btnTitle }: props) => {
  const [Files, setFiles] = useState<File[]>([]);

  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: userDatas?.imageUrl || '',
      name: userDatas?.firstName || '',
      username: userDatas?.username || '',
      bio: userDatas?.bio || '',
    },
  });

  const { startUpload } = useUploadThing('media');

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);
    if (hasImageChanged) {
      const imgRes = await startUpload(Files);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    await UserUpdate({
      userid: userDatas.id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      image: values.profile_photo,
      onboarded: true,
    });

    if (pathname === '/profile/edit') {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes('image')) return;
      fileReader.onload = async (event) => {
        const imageUrl = event.target?.result?.toString() || '';

        fieldChange(imageUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };
  return (
    <div className="text-white">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex  gap-10 flex-col justify-start"
        >
          <FormField
            control={form.control}
            name="profile_photo"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <FormLabel className="account-form_image-label">
                  {field.value ? (
                    <Image
                      src={field.value}
                      alt="profile photo"
                      width={96}
                      height={96}
                      priority
                      className="rounded-full object-contain "
                    />
                  ) : (
                    <Image
                      src="/assets/profile.svg"
                      alt="profile photo"
                      width={96}
                      height={96}
                      className="rounded-full object-contain"
                    />
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Upload a photo"
                    className="account-form_image-input"
                    onChange={(e) => handleImage(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex  flex-col  items-start gap-4">
                <FormLabel className="text-base-semibold w-[15%] text-light-2">
                  Name
                </FormLabel>
                <FormControl className="flex-1  text-base-semibold text-gray-200">
                  <Input
                    placeholder="Name"
                    className="account-form_input on-focus"
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
              <FormItem className="flex  flex-col  items-start gap-4">
                <FormLabel className="text-base-semibold w-[15%] text-light-2">
                  UserName
                </FormLabel>
                <FormControl className="flex-1  text-base-semibold text-gray-200">
                  <Input
                    placeholder="User Name"
                    className="account-form_input on-focus"
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
              <FormItem className="flex flex-col  items-start  gap-4">
                <FormLabel className="text-base-semibold w-[15%] text-light-2">
                  Bio
                </FormLabel>
                <FormControl className="flex-1  text-base-semibold text-gray-200">
                  <Textarea
                    placeholder="Bio"
                    rows={10}
                    className="account-form_input on-focus"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="bg-primary-500" type="submit">
            Continue
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AccountProfile;
