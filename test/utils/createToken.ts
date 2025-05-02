import { PrismaService } from '@/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TestingModule } from '@nestjs/testing';
import { createAccount } from '@test/shared';

export const createToken = async (moduleRef: TestingModule) => {
  const prisma = moduleRef.get(PrismaService);
  const jwt = moduleRef.get(JwtService);
  const user = await prisma.user.create({
    data: {
      name: createAccount.name,
      email: '123' + createAccount.email,
      password: createAccount.password,
    },
  });
  const accessToken = jwt.sign({ sub: user.id });
  return { prisma, accessToken, user };
};
