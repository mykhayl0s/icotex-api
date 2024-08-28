import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { ERole } from './roles.enum';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserService } from 'src/modules/user/users.service';
import { use } from 'passport';

export interface AuthUserPayload {
  _id: string;
  name: string;
  email: string;
  role: ERole;
}

export interface RequestWithUser extends Request {
  user: AuthUserPayload;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<ERole[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();

    if (!user) {
      return false;
    }
    const dbUsr = await this.userService.findById(user._id);
    if (dbUsr.role !== user.role) throw new ConflictException('Role changed');
    return requiredRoles.includes(user.role);
  }
}
