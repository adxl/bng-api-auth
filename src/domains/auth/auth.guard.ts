import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/users.entity';
import { RpcException } from '@nestjs/microservices';
import { RequestPayload } from '../../types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestPayload = context.switchToRpc().getData();
    request.user = await this.authService.findOne(request.token);

    if (!request.user) {
      throw new RpcException(new UnauthorizedException());
    }

    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(readonly roles: UserRole[] | '*') {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestPayload = context.switchToRpc().getData();

    if (this.roles !== '*' && !this.roles.includes(request.user.role)) {
      throw new RpcException(new ForbiddenException());
    }

    return true;
  }
}
