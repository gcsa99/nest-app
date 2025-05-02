import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Env } from 'config/env';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory(configService: ConfigService<Env, true>) {
        const publicKey = configService.get('JWT_PUBLIC', {
          infer: true,
        });
        const privateKey = configService.get('JWT_SECRET', {
          infer: true,
        });

        return {
          publicKey: Buffer.from(publicKey, 'base64'),
          privateKey: Buffer.from(privateKey, 'base64'),
          signOptions: {
            algorithm: 'RS256',
            expiresIn: '7d',
          },
        };
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
