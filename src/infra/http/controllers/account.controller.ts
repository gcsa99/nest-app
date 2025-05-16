import {
  BadRequestException,
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
import { CreateUserUseCase } from '@/domain/account/application/use-cases/create-user';
import { FindUserUseCase } from '@/domain/account/application/use-cases/find-user';
import { HttpUserPresenter } from '../presenters/http-user-presenter';
import { UserAlreadyExistsError } from '@/domain/account/application/use-cases/error/user-already-exists-error';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUser: FindUserUseCase,
  ) {}
  logger: LoggerService = new Logger(this.constructor.name);

  @Post()
  @HttpCode(201)
  async create(
    @Body(createAccountValidationPipe)
    data: CreateAccountBodySchema,
  ) {
    this.logger.log('Creating new account');
    const { name, email, password } = data;
    const result = await this.createUser.execute({
      name,
      email,
      password,
    });
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor == UserAlreadyExistsError) {
        this.logger.error('Error creating user', error.message);
        throw new ConflictException(error.message);
      }
      this.logger.error('Error creating user', error.message);
      throw new BadRequestException('Error creating user');
    }
    return {
      user: HttpUserPresenter.toHTTP(result.value.user),
    };
  }
  @Get()
  @HttpCode(200)
  async getAll() {
    this.logger.log('Fetching all accounts');
    const result = await this.findUser.execute();
    if (result.isLeft()) {
      throw new BadRequestException('Error fetching users');
    }
    const users = result.value.user.map((user) => {
      return HttpUserPresenter.toHTTP(user);
    });
    if (users.length === 0) {
      this.logger.log('No users found');
      return [];
    }
    this.logger.log(`Fetched ${users.length} users successfully`);
    return { users };
  }
}
