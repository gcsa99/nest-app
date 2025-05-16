import { User } from '@/domain/forum/enterprise/entities/user';

export class HttpUserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
