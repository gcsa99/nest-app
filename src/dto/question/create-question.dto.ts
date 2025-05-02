import { z } from 'zod';

import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';

export const createQuestionBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
export const bodyValidationPipe = new ZodValidationPipe(
  createQuestionBodySchema,
);

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;
