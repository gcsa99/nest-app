import { Module } from '@nestjs/common';
import {
  AccountController,
  AuthenticateController,
  QuestionController,
} from './controllers';
import { DatabaseModule } from '../database/database.module';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/authenticate-user';
import { CreateUserUseCase } from '@/domain/account/application/use-cases/create-user';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { FindUserUseCase } from '@/domain/account/application/use-cases/find-user';

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [AccountController, AuthenticateController, QuestionController],
  providers: [
    CreateQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateUserUseCase,
    CreateUserUseCase,
    FindUserUseCase,
  ],
})
export class HttpModule {}
