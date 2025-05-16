import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import {
  authenticateBodySchema,
  authenticateBodyValidationPipe,
} from '@/dto/authenticate/authenticate.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { AuthenticateUserUseCase } from '@/domain/account/application/use-cases/authenticate-user';
import { WrongCredentialsError } from '@/domain/account/application/use-cases/error/wrong-credentials-error';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Controller('sessions')
export class AuthenticateController {
  constructor(private readonly authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  async handle(
    @Body(authenticateBodyValidationPipe)
    body: authenticateBodySchema,
  ) {
    const { email, password } = body;
    const result = await this.authenticateUser.execute({
      email,
      password,
    });
    if (result.isLeft()) {
      const error = result.value;
      if (error.constructor == WrongCredentialsError) {
        throw new UnauthorizedException(error.message);
      }
      throw new BadRequestException(error.message);
    }
    const { accessToken } = result.value;
    return { accessToken };
  }
}
