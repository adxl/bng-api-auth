import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../users/role.entity';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;

  @InjectRepository(Role)
  private readonly rolesRepository: Repository<Role>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(data: RegisterDto): Promise<User> {
    const user: User | null = await this.usersRepository.findOneBy({
      email: data.email,
    });

    if (user) throw new BadRequestException('Email already exists');

    const newUser: User = this.usersRepository.create(data);

    newUser.role = await this.rolesRepository.findOneBy({
      name: 'UTILISATEUR',
    });

    this.usersRepository.insert(newUser);

    return newUser;
  }

  public async login(data: LoginDto): Promise<string> {
    const exists: User | null = await this.usersRepository.findOneBy({
      email: data.email,
    });

    if (!exists) {
      throw new NotFoundException('user', data.email);
    }

    const isPwdValid = this.helper.validPwd(exists, data.password);

    if (!isPwdValid) {
      throw new NotFoundException('user', data.email);
    }

    return this.helper.generateToken(exists);
  }
}
