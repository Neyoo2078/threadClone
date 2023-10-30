'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThreadValidation } from '@/lib/Validation/thread';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { postThread } from '@/lib/Actions/CreateThreads';
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
}

interface params {
  message: any;
  accountid: any;
  path: any;
  communityId: any;
}
const CreateThread = ({ userDatas }: props) => {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      message: '',
      accountid: userDatas?._id,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    console.log('clicked');

    await postThread({
      message: values?.message,
      author: values?.accountid,
      path: pathname,
      communityId: null,
    });

    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-[80%] gap-10 flex-col justify-start"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex  flex-col  items-start gap-4">
              <FormLabel className="text-base-semibold w-[15%] text-light-2">
                Content
              </FormLabel>
              <FormControl className="flex-1  text-base-semibold text-gray-200">
                <Textarea
                  placeholder="enter message here"
                  rows={10}
                  className="account-form_input on-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="bg-primary-500" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default CreateThread;
