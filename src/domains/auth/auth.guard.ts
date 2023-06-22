import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserRole } from '../users/users.entity';
import { RpcException } from '@nestjs/microservices';
import { TokenDto } from '../users/users.dto';

export const AuthGuard = (roles: Array<UserRole | '*'>) => {
  @Injectable()
  class _AuthGuard implements CanActivate {
    constructor(
      @Inject(AuthService)
      readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const jwt: TokenDto = context.switchToHttp().getRequest().jwt;

      const user: User = await this.authService.findOne(jwt.token);

      if (roles.includes('*') || !roles.includes(user.role)) {
        throw new RpcException(new ForbiddenException());
      }

      return true;
    }
  }

  return _AuthGuard;
};
