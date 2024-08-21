import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './roles.guard';

export const AuthUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): Promise<RequestWithUser> => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);