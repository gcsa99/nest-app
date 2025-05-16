import { AppModule } from '@infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { createSlug } from '@/utils/createSlug';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { createQuestion } from '@test/shared';
import { createToken } from '@test/utils/createToken';
import request from 'supertest';

suite('Question (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let user: User;

  const slug = createSlug(createQuestion[0].title);

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    ({ prisma, accessToken, user } = await createToken(moduleRef));
    await app.init();
  });

  describe('Create Question', () => {
    test('[POST] /questions', async () => {
      const response = await request(app.getHttpServer())
        .post('/questions')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createQuestion[0]);
      expect(response.statusCode).toBe(201);
    });

    it('should return the created question', async () => {
      const findedQuestion = await prisma.question.findUnique({
        where: {
          slug,
        },
      });
      expect(findedQuestion).toBeTruthy();
      expect(findedQuestion?.content).toBe(createQuestion[0].content);
    });
  });
  describe('Get Question', () => {
    test('[GET] /questions', async () => {
      const response = await request(app.getHttpServer())
        .get('/questions')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.questions).toBeInstanceOf(Array);
      expect(response.body.questions[0].content).toBe(
        createQuestion[0].content,
      );
    });

    it('should return questions', async () => {
      await prisma.question.createMany({
        data: [
          {
            ...createQuestion[1],
            slug: createSlug(createQuestion[1].title),
            authorId: user.id,
          },
          {
            ...createQuestion[2],
            slug: createSlug(createQuestion[2].title),
            authorId: user.id,
          },
        ],
      });
      const response = await request(app.getHttpServer())
        .get('/questions')
        .set('Authorization', `Bearer ${accessToken}`);
      expect(response.statusCode).toBe(200);
      const findedAccount = await prisma.question.findMany();
      expect(findedAccount).toBeTruthy();
      expect(response.body.questions[2].content).toBe(
        createQuestion[0].content,
      );
    });
  });
});
