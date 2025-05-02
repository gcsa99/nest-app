import { z } from 'zod';

import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';

export const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

export const createAccountValidationPipe = new ZodValidationPipe(
  createAccountBodySchema,
);
