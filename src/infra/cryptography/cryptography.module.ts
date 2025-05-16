import { Module } from '@nestjs/common';
import { JwtEncrypter } from './jwt-encrypter';
import { BcryptHasher } from './bcrypt-hasher';
import { Encrypter } from '@/domain/account/application/cryptography/encrypter';
import { Hasher } from '@/domain/account/application/cryptography/hasher';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: Hasher, useClass: BcryptHasher },
  ],
  exports: [Encrypter, Hasher],
})
export class CryptographyModule {}
