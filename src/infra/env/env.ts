import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  URL: z.string().url().optional().default('http://localhost'),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_PUBLIC: z.string().min(10),
  JWT_SECRET: z.string().min(10),
});

export type Env = z.infer<typeof envSchema>;
