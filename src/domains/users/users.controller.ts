import { ClassSerializerInterceptor, Controller, Inject, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';
import { User } from './users.entity';
import { UpdateUserRoleDto } from './dto/update-role.dto';
import { FindOneOrRemoveDto } from './dto/find-one-or-remove.dto';
import { UpdateUserDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller()
export class UsersController {
  @Inject(UsersService)
  private readonly userService: UsersService;

  @EventPattern('users.findAll')
  @UseInterceptors(ClassSerializerInterceptor)
  public findAll(token: string): Promise<User[]> {
    return this.userService.findAll(token);
  }

  @EventPattern('users.findOne')
  @UseInterceptors(ClassSerializerInterceptor)
  public findOne(body: FindOneOrRemoveDto): Promise<User> {
    return this.userService.findOne(body);
  }

  @EventPattern('users.updatePassword')
  public updatePassword(body: UpdatePasswordDto): Promise<object> {
    console.log(body);

    return this.userService.updatePassword(body);
  }

  @EventPattern('users.updateProfile')
  public updateProfile(body: UpdateUserDto): Promise<object> {
    return this.userService.updateProfile(body);
  }

  @EventPattern('users.updateRole')
  public updateRole(body: UpdateUserRoleDto): Promise<object> {
    return this.userService.updateRole(body);
  }

  @EventPattern('users.remove')
  public remove(body: FindOneOrRemoveDto): Promise<object> {
    return this.userService.remove(body);
  }
}
