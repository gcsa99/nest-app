import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  Logger,
  LoggerService,
  Post,
  UseGuards,
} from '@nestjs/common';
import { hash } from 'bcryptjs';

import { CreateAccountBodySchema, createAccountValidationPipe } from '@/dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { JwtAuthGuard } from '@/infra/auth';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly prisma: PrismaService) {}
  logger: LoggerService = new Logger(this.constructor.name);

  @Post()
  @HttpCode(201)
  async create(
    @Body(createAccountValidationPipe)
    data: CreateAccountBodySchema,
  ) {
    this.logger.log('Creating new account');
    const { name, email, password } = data;
    const userWithEmail = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userWithEmail) {
      this.logger.error(`Email already exists: ${email}`);
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await hash(password, 10);
    const createdUser = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    this.logger.log(`User created with ID: ${createdUser.id}`);
    return createdUser;
  }
  @Get()
  @HttpCode(200)
  async getAll() {
    this.logger.log('Fetching all accounts');
    const users = await this.prisma.user.findMany();
    this.logger.log(`Fetched ${users.length} accounts`);
    return users;
  }
}
