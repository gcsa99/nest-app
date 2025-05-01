import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-aut.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import {
  bodyValidationPipe,
  CreateQuestionBodySchema,
} from 'src/dto/question/create-question.dto';
import {
  GetQuestionQuerySchema,
  getQuestionQueryValidationPipe,
  GetQuestionResponseSchema,
} from 'src/dto/question/get-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';

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
        slug: `${title
          .toLowerCase()
          .replace(/\s+/g, '-')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')}`,
        authorId: user.sub,
      },
    });
  }
}
