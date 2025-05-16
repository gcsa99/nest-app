import { Either, left, right } from '@/core/either';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { UsersRepository } from '@/domain/forum/application/repositories/users-repository';
import { Hasher } from '../cryptography/hasher';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './error/wrong-credentials-error';

interface AuthenticateUserUseCaseRequest {
  email: string;
  password: string;
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hash: Hasher,
    private encrypt: Encrypter,
  ) {}
  logger: LoggerService = new Logger(this.constructor.name);

  async execute({
    password,
    email,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    this.logger.log(`Starting authenticate email: ${email}`);
    const findedUser = await this.userRepository.findByEmail(email);

    if (!findedUser) {
      this.logger.error(`User not found: ${email}`);
      return left(new WrongCredentialsError());
    }
    const isPasswordValid = await this.hash.compare(
      password,
      findedUser.password,
    );

    if (!isPasswordValid) {
      return left(new WrongCredentialsError());
    }
    const accessToken = await this.encrypt.encrypt({
      sub: findedUser.id.toString(),
    });

    return right({ accessToken });
  }
}
