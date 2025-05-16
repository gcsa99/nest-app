import { User } from '../../enterprise/entities/user';

export abstract class UsersRepository {
  abstract findByEmail(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: User): Promise<void>;
  abstract findMany(): Promise<User[] | null>;
}
