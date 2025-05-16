import { Encrypter } from '@/domain/account/application/cryptography/encrypter';

export class FakeEncrypt implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
