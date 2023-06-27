import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDto, UpdatePasswordDto, UpdateProfileDto, UpdateRoleDto } from './users.dto';
import { AuthService } from '../auth/auth.service';
import { AuthHelper } from '../auth/auth.helper';
import { MailerHelper } from '../../helpers/mailer.helper';

import * as md5 from 'md5';
import * as bcrypt from 'bcryptjs';

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

  public async findMany(ids: string[]): Promise<User[]> {
    return this.userRepository.findBy({
      id: In(ids),
      removed: false,
    });
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

  public async updatePassword(body: UpdatePasswordDto): Promise<UpdateResult> {
    const user: User = await this.authService.findOne(body.token);

    if (!this.helper.validPwd(user, body.oldPwd)) {
      throw new RpcException(new NotFoundException('User not found!'));
    }

    user.password = await this.helper.hashPwd(body.password);

    return this.userRepository.update(user.id, user);
  }

  public async updateProfile(body: UpdateProfileDto): Promise<UpdateResult> {
    const user: User = await this.authService.findOne(body.token);

    delete body.token;

    return this.userRepository.update(user.id, body);
  }

  public async updateRole(body: UpdateRoleDto): Promise<UpdateResult> {
    return this.userRepository.update(body.id, { role: body.role });
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
