import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { GetUser, JwtAuthGuard, UserPayload } from '@/infra/auth';
import {
  bodyValidationPipe,
  CreateQuestionBodySchema,
  GetQuestionQuerySchema,
  getQuestionQueryValidationPipe,
} from '@/dto';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { HttpQuestionPresenter } from '../presenters/http-question-presenter';

@Controller('questions')
export class QuestionController {
  constructor(
    private readonly createQuestion: CreateQuestionUseCase,
    private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}

  logger = new Logger(this.constructor.name);

  @Get()
  async getAll(
    @Query(getQuestionQueryValidationPipe) query: GetQuestionQuerySchema,
  ) {
    this.logger.log('Fetching all questions');
    const result = await this.fetchRecentQuestions.execute({
      page: query.page,
    });

    if (result.isLeft()) {
      this.logger.error('Error fetching questions');
      throw new Error('Error fetching questions');
    }
    this.logger.log('Questions fetched successfully');
    const questions = result.value.questions.map((question) =>
      HttpQuestionPresenter.toHTTP(question),
    );
    if (questions.length === 0) {
      this.logger.log('No questions found');
      return [];
    }
    this.logger.log('Questions found successfully');
    return { questions };
  }

  @Post()
  async create(
    @GetUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
  ) {
    this.logger.log('Creating new question');
    const { title, content } = body;
    await this.createQuestion.execute({
      title,
      content,
      attachmentsIds: [],
      authorId: user.sub,
    });
  }
}
