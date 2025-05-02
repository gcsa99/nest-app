import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser, JwtAuthGuard, UserPayload } from '@/auth';
import {
  bodyValidationPipe,
  CreateQuestionBodySchema,
  GetQuestionQuerySchema,
  getQuestionQueryValidationPipe,
  GetQuestionResponseSchema,
} from '@/dto';
import { PrismaService } from '@/prisma/prisma.service';
import { createSlug } from '@/utils/createSlug';

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionController {
  constructor(private readonly prisma: PrismaService) {}

  logger = new Logger(this.constructor.name);

  @Get()
  async getAll(
    @Query(getQuestionQueryValidationPipe) query: GetQuestionQuerySchema,
  ): Promise<GetQuestionResponseSchema[]> {
    this.logger.log('Fetching all questions');
    const questions = await this.prisma.question.findMany({
      take: query.limit,
      skip: (query.page - 1) * query.limit,
      where: {
        title: {
          contains: query.search,
        },
        authorId: query.authorId,
      },
      orderBy: {
        [query.orderBy]: query.sort,
      },
    });
    this.logger.log(`Fetched ${questions.length} questions`);
    return questions;
  }

  @Post()
  async create(
    @GetUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
  ) {
    this.logger.log('Creating new question');
    const { title, content } = body;
    await this.prisma.question.create({
      data: {
        title,
        content,
        slug: createSlug(title),
        authorId: user.sub,
      },
    });
  }
}
