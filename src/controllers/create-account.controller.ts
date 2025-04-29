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
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import { z } from 'zod';

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller('accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}
  logger: LoggerService = new Logger(this.constructor.name);

  @Post()
  @HttpCode(201)
  async handle(
    @Body(new ZodValidationPipe(createAccountBodySchema))
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
