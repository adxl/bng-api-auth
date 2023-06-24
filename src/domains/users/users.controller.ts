import { ClassSerializerInterceptor, Controller, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';
import { User } from './users.entity';

import {
  CreateDtoWrapper,
  FindOneDto,
  RemoveDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  UpdateRoleDto,
} from './users.dto';
import { AuthGuard, RolesGuard } from '../auth/auth.guard';

@Controller()
export class UsersController {
  @Inject(UsersService)
  private readonly userService: UsersService;

  @EventPattern('users.findAll')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMINISTRATOR, UserRole.ORGANIZER]))
  @UseInterceptors(ClassSerializerInterceptor)
  public findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @EventPattern('users.findOne')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  @UseInterceptors(ClassSerializerInterceptor)
  public findOne(body: FindOneDto): Promise<User> {
    return this.userService.findOne(body.id);
  }

  @EventPattern('users.create')
  @UseGuards(AuthGuard([UserRole.ADMINISTRATOR]))
  @UseInterceptors(ClassSerializerInterceptor)
  public create(body: CreateDtoWrapper): Promise<User> {
    return this.userService.create(body);
  }

  @EventPattern('users.updatePassword')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public updatePassword(body: UpdatePasswordDto): Promise<object> {
    return this.userService.updatePassword(body);
  }

  @EventPattern('users.updateProfile')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public updateProfile(body: UpdateProfileDto): Promise<object> {
    return this.userService.updateProfile(body);
  }

  @EventPattern('users.updateRole')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public updateRole(body: UpdateRoleDto): Promise<object> {
    return this.userService.updateRole(body);
  }

  @EventPattern('users.remove')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public remove(body: RemoveDto): Promise<object> {
    return this.userService.remove(body);
  }
}
