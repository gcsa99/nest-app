import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import { execSync } from 'child_process';

const prisma = new PrismaClient({});
const schemaId = 'test__' + randomUUID();

beforeAll(() => {
  const databaseURL = generateUniqueDatabaseURL(schemaId);
  process.env.DATABASE_URL = databaseURL;
  execSync('pnpm prisma migrate deploy');
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(
    `DROP SCHEMA IF EXISTS "${schemaId}" CASCADE;`,
  );
  await prisma.$disconnect();
});

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }
  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', `${schemaId}`);
  return url.toString();
}
