import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto, UpdateCapsDto, UpdatePasswordDto, UpdateProfileDto, UpdateRoleDto } from './users.dto';
import { AuthService } from '../auth/auth.service';
import { AuthHelper } from '../auth/auth.helper';
import { MailerHelper } from '../../helpers/mailer.helper';

import * as md5 from 'md5';
import * as bcrypt from 'bcryptjs';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @Inject(forwardRef(() => AuthService))
  private readonly authService: AuthService;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  @Inject(MailerHelper)
  private readonly mailerHelper: MailerHelper;

  public async findAll(): Promise<User[]> {
    const users = await this.userRepository.find({
      where: { removed: false },
    });
    return users.map((u) => plainToInstance(User, u, { groups: ['admin'] }));
  }

  public async findOne(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: { id, removed: false },
    });

    if (!user) throw new RpcException(new NotFoundException('User not found!'));

    return user;
  }

  public async findMany(ids: string[], isPublic = true): Promise<User[]> {
    const users = await this.userRepository.findBy({
      id: In(ids),
      removed: false,
    });

    if (isPublic) {
      return users;
    }

    return users.map((u) => plainToInstance(User, u, { groups: ['admin'] }));
  }

  public async create(data: CreateUserDto): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({
      email: data.email,
    });

    if (user) throw new RpcException(new BadRequestException('Email already exists'));

    const newUser: User = this.userRepository.create(data);

    newUser.password = md5(data.email);

    await this.mailerHelper.sendUserCreationEmail(newUser.email, newUser.password);

    await this.userRepository.insert(newUser);

    return newUser;
  }

  public async updatePassword(token: string, body: UpdatePasswordDto): Promise<UpdateResult> {
    const user: User = await this.authService.findOne(token);

    if (!this.helper.validPwd(user, body.oldPwd)) {
      throw new RpcException(new NotFoundException('User not found!'));
    }

    user.password = await this.helper.hashPwd(body.password);

    return this.userRepository.update(user.id, user);
  }

  public async updateProfile(token, body: UpdateProfileDto): Promise<UpdateResult> {
    const user: User = await this.authService.findOne(token);
    return this.userRepository.update(user.id, body);
  }

  public async updateRole(id: string, body: UpdateRoleDto): Promise<UpdateResult> {
    return this.userRepository.update(id, { role: body.role });
  }

  public async updateCaps(id: string, body: UpdateCapsDto): Promise<UpdateResult> {
    if (body.add) return this.userRepository.increment({ id }, 'caps', body.caps);
    return this.userRepository.decrement({ id }, 'caps', body.caps);
  }

  public async remove(id: string): Promise<DeleteResult> {
    const user: User = await this.findOne(id);

    user.email = md5(user.id) + '@bng-removed.com';
    user.password = bcrypt.hashSync(md5(user.id));
    user.firstName = null;
    user.lastName = null;
    user.removed = true;

    return this.userRepository.update(user.id, user);
  }
}
