import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { RegisterDtoWrapper } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RpcException } from '@nestjs/microservices';
import { JwtObject } from './jwt-object.interface';
import { VerifyDto } from './dto/verify.dto';
import { UsersService } from '../users/users.service';
import * as md5 from 'md5';
import { MailerHelper } from 'src/helpers/mailer.helper';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly usersRepository: Repository<User>;

  @Inject(forwardRef(() => UsersService))
  private readonly usersService: UsersService;

  @Inject(AuthHelper)
  private readonly helper: AuthHelper;

  @Inject(MailerHelper)
  private readonly mailerHelper: MailerHelper;

  public async register(data: RegisterDtoWrapper): Promise<User> {
    const user: User | null = await this.usersRepository.findOneBy({
      email: data.body.email,
    });

    if (user) throw new RpcException(new BadRequestException('Email already exists'));

    const newUser: User = this.usersRepository.create(data.body);

    newUser.password = md5(data.body.email);

    this.mailerHelper.sendUserCreationEmail(newUser.email, newUser.password);

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
    const token: string = this.helper.extractToken(body.jwt.token);

    const tokenObject: JwtObject = this.helper.decodeToken(token);

    const user: User | null = await this.usersRepository.findOneBy({
      id: tokenObject.id,
      removed: false,
    });

    if (!user) throw new RpcException(new UnauthorizedException('User unauthorized!'));

    if (!body.roles.includes(user.role) && !body.roles.includes('*'))
      throw new RpcException(new ForbiddenException('Forbidden access!'));

    return tokenObject.id;
  }

  public async findOne(token: string): Promise<User> {
    if (!/^Bearer .+$/.test(token)) {
      throw new RpcException(new BadRequestException('Invalid JWT'));
    }

    const tokenObject: JwtObject = this.helper.decodeToken(this.helper.extractToken(token));

    const user: User = await this.usersService.findOne(tokenObject.id);

    return user;
  }
}
