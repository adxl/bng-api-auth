import { ClassSerializerInterceptor, Controller, HttpCode, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices';
import { User } from './users.entity';
import { UpdateUserRoleDto } from './dto/update-role.dto';

@Controller()
export class UsersController {
  @Inject(UsersService)
  private readonly userService: UsersService;

  @EventPattern("allUsers")
  @UseInterceptors(ClassSerializerInterceptor)
  public getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @EventPattern("oneUser")
  @UseInterceptors(ClassSerializerInterceptor)
  public getOneUser(id: string): Promise<User> {
    return this.userService.getOneUser(id);
  }

  @EventPattern("updateRole")
  public changeUserRole(body: UpdateUserRoleDto): Promise<object> {
    return this.userService.updateRole(body.id, body.role);
  }

  @EventPattern("removeUser")
  public removeUser(id: string): Promise<object> {
    return this.userService.removeUser(id);
  }
}
