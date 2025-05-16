import { Hasher } from '@/domain/account/application/cryptography/hasher';
import { compare, hash } from 'bcryptjs';

export class BcryptHasher implements Hasher {
  private SALT_ROUNDS = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.SALT_ROUNDS);
  }
  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
