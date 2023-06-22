import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { RemoveDto, UpdatePasswordDto, UpdateProfileDto, UpdateRoleDto } from './users.dto';
import { AuthService } from '../auth/auth.service';
import { AuthHelper } from '../auth/auth.helper';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(forwardRef(() => AuthService))
  private readonly authService: AuthService;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { removed: false },
    });
  }

  public async findOne(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id, removed: false },
    });

    if (!user) throw new RpcException(new NotFoundException('User not found!'));

    return user;
  }

  public async updatePassword(body: UpdatePasswordDto): Promise<object> {
    const user: User = await this.authService.findOne(body.jwt.token);

    if (!this.helper.validPwd(user, body.oldPwd)) {
      throw new RpcException(new NotFoundException('User not found!'));
    }

    user.password = await this.helper.hashPwd(body.password);

    return this.userRepository.update(user.id, user);
  }

  public async updateProfile(body: UpdateProfileDto): Promise<object> {
    const user: User = await this.authService.findOne(body.jwt.token);

    delete body.jwt;

    return this.userRepository.update(user.id, body);
  }

  public async updateRole(body: UpdateRoleDto): Promise<object> {
    return this.userRepository.update(body.id, { role: body.role });
  }

  public async remove(body: RemoveDto): Promise<object> {
    const user: User = await this.findOne(body.id);

    user.password = '';
    user.email = user.id; // Else unique constraint error
    user.firstName = '';
    user.lastName = '';
    user.removed = true;

    return this.userRepository.update(user.id, user);
  }
}
