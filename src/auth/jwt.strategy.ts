import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Env } from 'config/env';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC', { infer: true });
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  logger = new Logger(this.constructor.name);

  validate(payload: UserPayload): UserPayload {
    this.logger.log('Validating JWT payload');
    return tokenPayloadSchema.parse(payload);
  }
}
