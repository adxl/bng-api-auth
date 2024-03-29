import { ClassSerializerInterceptor, Controller, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { User, UserRole } from './users.entity';

import {
  CreateUserPayload,
  UpdateCapsPayload,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  UpdateRolePayload,
} from './users.dto';
import { AuthGuard, RolesGuard } from '../auth/auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { RequestPayload } from '../../types';

@Controller()
export class UsersController {
  @Inject(UsersService)
  private readonly userService: UsersService;

  @EventPattern('users.findAll')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMINISTRATOR, UserRole.ORGANIZER]))
  public findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @EventPattern('users.findOne')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMINISTRATOR]))
  @UseInterceptors(ClassSerializerInterceptor)
  public findOne(@Payload() payload: RequestPayload): Promise<User> {
    return this.userService.findOne(payload.id);
  }

  @EventPattern('users.findMany')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMINISTRATOR, UserRole.ORGANIZER, UserRole.TECHNICIAN]))
  public findMany(@Payload() payload: RequestPayload): Promise<User[]> {
    return this.userService.findMany(payload.ids);
  }

  @EventPattern('users.findMany.public')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  @UseInterceptors(ClassSerializerInterceptor)
  public findManyPublic(@Payload() payload: RequestPayload): Promise<User[]> {
    return this.userService.findMany(payload.ids);
  }

  @EventPattern('users.create')
  @UseGuards(AuthGuard, new RolesGuard([UserRole.ADMINISTRATOR]))
  @UseInterceptors(ClassSerializerInterceptor)
  public create(@Payload() payload: CreateUserPayload): Promise<User> {
    return this.userService.create(payload.body);
  }

  @EventPattern('users.updatePassword')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public updatePassword(@Payload() payload: UpdatePasswordPayload): Promise<UpdateResult> {
    return this.userService.updatePassword(payload.token, payload.body);
  }

  @EventPattern('users.updateProfile')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public updateProfile(@Payload() payload: UpdateProfilePayload): Promise<UpdateResult> {
    return this.userService.updateProfile(payload.token, payload.body);
  }

  @EventPattern('users.updateRole')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public updateRole(@Payload() payload: UpdateRolePayload): Promise<UpdateResult> {
    return this.userService.updateRole(payload.id, payload.body);
  }

  @EventPattern('users.updateCaps')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public updateCaps(@Payload() payload: UpdateCapsPayload): Promise<UpdateResult> {
    return this.userService.updateCaps(payload.id, payload.body);
  }

  @EventPattern('users.remove')
  @UseGuards(AuthGuard, new RolesGuard('*'))
  public remove(@Payload() payload: RequestPayload): Promise<DeleteResult> {
    return this.userService.remove(payload.id);
  }
}
