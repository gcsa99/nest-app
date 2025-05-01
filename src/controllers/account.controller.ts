import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Logger,
  LoggerService,
  Post,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateAccountBodySchema, createAccountValidationPipe } from 'src/dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('accounts')
export class AccountController {
  constructor(private readonly prisma: PrismaService) {}
  logger: LoggerService = new Logger(this.constructor.name);

  @Post()
  @HttpCode(201)
  async handle(
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
}
