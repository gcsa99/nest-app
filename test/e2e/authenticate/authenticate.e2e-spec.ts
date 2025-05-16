import { AppModule } from '@infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';
import { createAccount } from '@test/shared';

suite('Authenticate (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    await app.init();
  });

  describe('Get Token', () => {
    test('[POST] /session', async () => {
      const hashedPassword = await hash(createAccount.password, 10);
      await prisma.user.create({
        data: {
          name: createAccount.name,
          email: createAccount.email,
          password: hashedPassword,
        },
      });
    });
    it('should return the access_token', async () => {
      const response = await request(app.getHttpServer())
        .post('/sessions')
        .send({
          email: createAccount.email,
          password: createAccount.password,
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({
        accessToken: expect.any(String),
      });
    });
  });
});
