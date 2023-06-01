import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-profile.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateUserRoleDto } from './dto/update-role.dto';
import { FindOneOrRemoveDto } from './dto/find-one-or-remove.dto';
import { AuthService } from '../auth/auth.service';
import { AuthHelper } from '../auth/auth.helper';
import { JwtObject } from '../auth/jwt-object.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(AuthService)
  private readonly authService: AuthService;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async findAll(token: string): Promise<User[]> {
    const reqUser: string | undefined = await this.authService.verify({
      token,
      role: UserRole.ADMINISTRATOR,
    });

    if (!reqUser) throw new RpcException(new ForbiddenException('Access forbidden!'));

    const users: User[] | null = await this.userRepository.find({
      where: { removed: false },
    });

    if (!users) throw new RpcException(new NotFoundException('No users found!'));

    return users;
  }

  public async findOne(body: FindOneOrRemoveDto): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id: body.id,
        removed: false,
      },
    });

    if (!user) throw new RpcException(new NotFoundException('User not found!'));

    return user;
  }

  public async updatePassword(body: UpdatePasswordDto): Promise<object> {
    const token: string | undefined = this.helper.extractToken(body.token);

    if (!token) throw new RpcException(new BadRequestException('No token provided!'));

    const reqUser: JwtObject = this.helper.decodeToken(token);

    const user: User | null = await this.userRepository.findOneBy({
      id: reqUser.id,
      removed: false,
    });

    if (!user || !this.helper.validPwd(user, body.oldPwd))
      throw new RpcException(new NotFoundException('User not found!'));

    user.password = await this.helper.hashPwd(body.newPwd);

    await this.userRepository.save(user);

    return { statusCode: 200, message: 'User updated succesfully' };
  }

  public async updateProfile(body: UpdateUserDto): Promise<object> {
    const token: string | undefined = this.helper.extractToken(body.token);

    if (!token) throw new RpcException(new BadRequestException('No token provided!'));

    const reqUser: JwtObject = this.helper.decodeToken(token);

    const user: User | null = await this.userRepository.findOneBy({
      id: reqUser.id,
      removed: false,
    });

    if (!user) throw new RpcException(new NotFoundException('User not found!'));

    if (body.firstName && body.firstName?.length > 0) user.firstName = body.firstName;

    if (body.lastName && body.lastName?.length > 0) user.lastName = body.lastName;

    await this.userRepository.save(user);

    return { statusCode: 200, message: 'User updated succesfully' };
  }

  public async updateRole(body: UpdateUserRoleDto): Promise<object> {
    const reqUser: string | undefined = await this.authService.verify({
      token: body.token,
      role: UserRole.ADMINISTRATOR,
    });

    if (!reqUser) throw new RpcException(new ForbiddenException('Access forbidden!'));

    const user: User | null = await this.userRepository.findOne({
      where: {
        id: body.id,
        removed: false,
      },
    });

    if (!user) throw new RpcException(new NotFoundException('User not found'));

    user.role = body.role;

    await this.userRepository.save(user);

    return { statusCode: 200, message: 'User updated succesfully' };
  }

  public async remove(body: FindOneOrRemoveDto): Promise<object> {
    const reqUser: string | undefined = await this.authService.verify({
      token: body.token,
      role: UserRole.ADMINISTRATOR,
    });

    if (!reqUser) throw new RpcException(new ForbiddenException('Access forbidden!'));

    const user: User | null = await this.userRepository.findOne({
      where: {
        id: body.id,
        removed: false,
      },
    });

    if (!user) throw new RpcException(new NotFoundException('User not found or already removed!'));

    user.removed = true;

    await this.userRepository.save(user);

    return { statusCode: 200, message: 'User' };
  }
}
