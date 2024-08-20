import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ERole } from './roles.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';


export interface RequestWithUser extends Request {
    user: {
        _id: string;
        name: string;
        email: string
        role: ERole;
    };
}

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredRoles = this.reflector.get<ERole[]>(ROLES_KEY, context.getHandler());

        console.log(requiredRoles)

        const { user } = context.switchToHttp().getRequest<RequestWithUser>();

        if (!user) {
            return false
        }

        return requiredRoles.includes(user.role)
    }
}
