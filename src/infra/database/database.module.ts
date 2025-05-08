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
    ...repositories,
  ],
  exports: [PrismaService, QuestionsRepository, ...repositories],
})
export class DatabaseModule {}
