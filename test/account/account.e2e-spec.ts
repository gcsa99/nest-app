import { AppModule } from '@infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { createAccount } from '@test/shared';
import { createToken } from '@test/utils/createToken';

suite('Account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    ({ prisma, accessToken } = await createToken(moduleRef));

    await app.init();
  });

  describe('Create Account', () => {
    test('[POST] /accounts', async () => {
      const response = await request(app.getHttpServer())
        .post('/accounts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createAccount);
      expect(response.statusCode).toBe(201);
    });
    it('should return the created account', async () => {
      const findedAccount = await prisma.user.findUnique({
        where: {
          email: createAccount.email,
        },
      });
      expect(findedAccount).toBeTruthy();
      expect(findedAccount).toBeDefined();
      expect(findedAccount?.name).toBe(createAccount.name);
    });
  });
  describe('Get Account', () => {
    test('[GET] /accounts', async () => {
      const response = await request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toBe(createAccount.name);
    });
    it('should return accounts', async () => {
      const response = await request(app.getHttpServer())
        .get('/accounts')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      const findedAccount = await prisma.user.findUnique({
        where: {
          email: createAccount.email,
        },
      });
      expect(findedAccount).toBeTruthy();
      expect(findedAccount).toBeDefined();
      expect(response.body[0].name).toBe(createAccount.name);
    });
  });
});
