import { Either, left, right } from '@/core/either';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { UserAlreadyExistsError } from './error/user-already-exists-error';
import { User } from '@/domain/forum/enterprise/entities/user';
import { UsersRepository } from '@/domain/forum/application/repositories/users-repository';
import { Hasher } from '../cryptography/hasher';

type FindUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User[];
  }
>;

@Injectable()
export class FindUserUseCase {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly hash: Hasher,
  ) {}
  logger: LoggerService = new Logger(this.constructor.name);

  async execute(): Promise<FindUserUseCaseResponse> {
    this.logger.log('Searching users');
    const users = await this.userRepository.findMany();
    if (!users) {
      this.logger.error('No users found');
      return left(new UserAlreadyExistsError('No users found'));
    }
    return right({ user: users });
  }
}
