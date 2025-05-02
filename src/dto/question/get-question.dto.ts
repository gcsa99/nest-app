import { z } from 'zod';

import { ZodValidationPipe } from '@/pipes/zod-validation.pipe';

export const getQuestionQuerySchema = z.object({
  id: z.string().uuid().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  sort: z.enum(['asc', 'desc']).default('asc'),
  orderBy: z.enum(['createdAt', 'updatedAt']).default('createdAt'),
  search: z.string().optional(),
  authorId: z.string().uuid().optional(),
});

export type GetQuestionQuerySchema = z.infer<typeof getQuestionQuerySchema>;

export const getQuestionQueryValidationPipe = new ZodValidationPipe(
  getQuestionQuerySchema,
);

export const getQuestionResponseSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  authorId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});
export type GetQuestionResponseSchema = z.infer<
  typeof getQuestionResponseSchema
>;
