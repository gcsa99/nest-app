import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { z } from 'zod';

export const createQuestionBodySchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});
export const bodyValidationPipe = new ZodValidationPipe(
  createQuestionBodySchema,
);

export type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;
