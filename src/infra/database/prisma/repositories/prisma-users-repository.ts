import { PaginationParams } from '@/core/repositories/pagination-params';
import { UsersRepository } from '@/domain/forum/application/repositories/users-repository';
import { User } from '@/domain/forum/enterprise/entities/user';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaUserMapper } from '../mappers/prisma-user-mapper';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(): Promise<User[] | null> {
    const user = await this.prisma.user.findMany({});
    if (!user) {
      return null;
    }
    return user.map((user) => {
      return PrismaUserMapper.toDomain(user);
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return null;
    }

    return PrismaUserMapper.toDomain(user);
  }

  async create(user: User): Promise<void> {
    const data = PrismaUserMapper.toPersistence(user);
    await this.prisma.user.create({
      data,
    });
  }
}
