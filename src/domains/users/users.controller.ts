import { ClassSerializerInterceptor, Controller, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';
import { User, UserRole } from './users.entity';

import { FindOneDto, RemoveDto, UpdatePasswordDto, UpdateProfileDto, UpdateRoleDto } from './users.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller()
export class UsersController {
  @Inject(UsersService)
  private readonly userService: UsersService;

  @EventPattern('users.findAll')
  @UseGuards(AuthGuard([UserRole.ADMINISTRATOR]))
  @UseInterceptors(ClassSerializerInterceptor)
  public findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @EventPattern('users.findOne')
  @UseGuards(AuthGuard(['*']))
  @UseInterceptors(ClassSerializerInterceptor)
  public findOne(body: FindOneDto): Promise<User> {
    return this.userService.findOne(body.id);
  }

  @EventPattern('users.updatePassword')
  @UseGuards(AuthGuard(['*']))
  public updatePassword(body: UpdatePasswordDto): Promise<object> {
    return this.userService.updatePassword(body);
  }

  @EventPattern('users.updateProfile')
  @UseGuards(AuthGuard(['*']))
  public updateProfile(body: UpdateProfileDto): Promise<object> {
    return this.userService.updateProfile(body);
  }

  @EventPattern('users.updateRole')
  @UseGuards(AuthGuard([UserRole.ADMINISTRATOR]))
  public updateRole(body: UpdateRoleDto): Promise<object> {
    return this.userService.updateRole(body);
  }

  @EventPattern('users.remove')
  @UseGuards(AuthGuard([UserRole.ADMINISTRATOR]))
  public remove(body: RemoveDto): Promise<object> {
    return this.userService.remove(body);
  }
}
