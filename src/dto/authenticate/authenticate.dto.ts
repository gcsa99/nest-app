import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { z } from 'zod';

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type authenticateBodySchema = z.infer<typeof authenticateBodySchema>;

export const authenticateBodyValidationPipe = new ZodValidationPipe(
  authenticateBodySchema,
);
