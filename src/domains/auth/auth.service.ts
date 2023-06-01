import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RpcException } from '@nestjs/microservices';
import { JwtObject } from './jwt-object.interface';
import { VerifyDto } from './dto/verify.dto';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  public async register(data: RegisterDto): Promise<User> {
    const user: User | null = await this.usersRepository.findOneBy({
      email: data.email,
    });

    if (user) throw new RpcException(new BadRequestException('Email already exists'));

    const newUser: User = this.usersRepository.create(data);

    this.usersRepository.insert(newUser);

    return newUser;
  }

  public async login(data: LoginDto): Promise<string> {
    const exists: User | null = await this.usersRepository.findOneBy({
      email: data.email,
      removed: false,
    });

    if (!exists) {
      throw new RpcException(new NotFoundException('User not found!'));
    }

    const isPwdValid = this.helper.validPwd(exists, data.password);

    if (!isPwdValid) {
      throw new RpcException(new NotFoundException('User not found!'));
    }

    return this.helper.generateToken(exists);
  }

  public async verify(body: VerifyDto): Promise<string> {
    const token: string | undefined = this.helper.extractToken(body.token);

    if (!token) throw new RpcException(new BadRequestException('No token provided!'));

    const tokenObject: JwtObject = this.helper.decodeToken(token);

    const user: User | null = await this.usersRepository.findOneBy({
      id: tokenObject.id,
      removed: false,
    });

    if (!user) throw new RpcException(new UnauthorizedException('User unauthorized!'));

    if (user.role !== body.role) throw new RpcException(new ForbiddenException('Forbidden access!'));

    return tokenObject.id;
  }
}
