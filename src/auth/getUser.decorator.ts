import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.strategy';

export const GetUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserPayload;
  },
);
