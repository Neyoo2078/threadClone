import * as z from 'zod';

export const ThreadValidation = z.object({
  message: z.string().min(3, { message: 'Minimum 3 characters.' }).nonempty(),
  accountid: z.string(),
});
