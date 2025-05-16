import { Either, left, right } from '@/core/either';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { UserAlreadyExistsError } from './error/user-already-exists-error';
import { User } from '@/domain/forum/enterprise/entities/user';
import { UsersRepository } from '@/domain/forum/application/repositories/users-repository';
import { Hasher } from '../cryptography/hasher';

interface CreateUserUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User;
  }
>;

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hash: Hasher,
  ) {}
  logger: LoggerService = new Logger(this.constructor.name);

  async execute({
    name,
    password,
    email,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    this.logger.log(`Creating user with email ${email}`);
    const userWithEmail = await this.userRepository.findByEmail(email);

    if (userWithEmail) {
      this.logger.error(`Email already exists: ${email}`);
      return left(new UserAlreadyExistsError(`with email ${email}`));
    }
    const hashedPassword = await this.hash.hash(password);

    const user = User.create({ name, email, password: hashedPassword });
    await this.userRepository.create(user);
    this.logger.log(`User created with ID: ${user.id?.toString()}`);
    return right({ user });
  }
}
