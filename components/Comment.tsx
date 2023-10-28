'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CommentValidation } from '@/lib/Validation/comment';
import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { ThreadComment } from '@/lib/Actions/CreateThreads';
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
import { usePathname } from 'next/navigation';

interface props {
  Threadid: string;
  CurrentUserId: string;
  CurrentUserImg: string;
}
const Comment = ({ Threadid, CurrentUserId, CurrentUserImg }: props) => {
  const path = usePathname();
  const [imageMessage, setimageMessage] = useState('');
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    console.log({
      message: values.message,
      author: CurrentUserId,
      parentid: Threadid,
    });

    await ThreadComment(
      values.message,
      CurrentUserId,
      Threadid,
      imageMessage,
      path
    );
    form.reset();
  };
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center items-center gap-3 border-gray-600 p-7 border-[1px] w-full"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex w-full items-center gap-1">
                <FormLabel className="text-base-semibold text-light-2">
                  <Image
                    src={CurrentUserImg}
                    alt="profile photo"
                    width={48}
                    height={48}
                    priority
                    className="rounded-full object-contain "
                  />
                </FormLabel>
                <FormControl className="border-none bg-transparent">
                  <Input
                    placeholder="Comment..."
                    className="no-focus text-light-1  outline-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button className="bg-primary-500" type="submit">
            Reply
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Comment;
