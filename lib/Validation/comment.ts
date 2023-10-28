import * as z from 'zod';

export const CommentValidation = z.object({
  message: z.string().min(3, { message: 'Minimum 3 characters.' }),
});

export const FormSchema = z.object({
  message: z
    .string()
    .min(10, {
      message: 'Bio must be at least 10 characters.',
    })
    .max(160, {
      message: 'Bio must not be longer than 30 characters.',
    }),
});
