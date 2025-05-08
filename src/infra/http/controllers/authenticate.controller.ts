import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

import {
  authenticateBodySchema,
  authenticateBodyValidationPipe,
} from '@/dto/authenticate/authenticate.dto';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Controller('sessions')
export class AuthenticateController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async handle(
    @Body(authenticateBodyValidationPipe)
    body: authenticateBodySchema,
  ) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const accessToken = this.jwt.sign({ sub: user.id });

    return { access_token: accessToken };
  }
}
