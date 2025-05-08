import { Module } from '@nestjs/common';
import {
  AccountController,
  AuthenticateController,
  QuestionController,
} from './controllers';
import { DatabaseModule } from '../database/database.module';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController, AuthenticateController, QuestionController],
  providers: [CreateQuestionUseCase, FetchRecentQuestionsUseCase],
})
export class HttpModule {}
