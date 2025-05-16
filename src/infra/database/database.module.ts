import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import {
  PrismaAnswerAttachmentsRepository,
  PrismaAnswerCommentsRepository,
  PrismaAnswerRepository,
  PrismaQuestionsAttachmentsRepository,
  PrismaQuestionsCommentsRepository,
  PrismaQuestionsRepository,
} from './prisma/repositories';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import { UsersRepository } from '@/domain/forum/application/repositories/users-repository';
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository';

const repositories = [
  PrismaQuestionsAttachmentsRepository,
  PrismaQuestionsCommentsRepository,
  PrismaAnswerRepository,
  PrismaAnswerAttachmentsRepository,
  PrismaAnswerCommentsRepository,
];

@Module({
  providers: [
    PrismaService,
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },

    { provide: UsersRepository, useClass: PrismaUsersRepository },

    ...repositories,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    UsersRepository,
    ...repositories,
  ],
})
export class DatabaseModule {}
