import { Encrypt } from '@/domain/account/application/cryptography/encrypt';

export class FakeEncrypt implements Encrypt {
  async sign(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload);
  }
}
