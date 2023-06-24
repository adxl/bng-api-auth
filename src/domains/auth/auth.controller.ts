import { ClassSerializerInterceptor, Controller, Inject, UseInterceptors } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/users.entity';
import { VerifyDto } from './dto/verify.dto';
import { RequestToken } from '../../types/token';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @EventPattern('auth.register')
  @UseInterceptors(ClassSerializerInterceptor)
  public register(data: RegisterDto): Promise<User> {
    return this.authService.register(data);
  }

  @EventPattern('auth.login')
  public login(data: LoginDto): Promise<string> {
    return this.authService.login(data);
  }

  @EventPattern('auth.verify')
  public verify(body: VerifyDto): Promise<string> {
    return this.authService.verify(body);
  }

  @EventPattern('auth.me')
  @UseInterceptors(ClassSerializerInterceptor)
  public me(body: RequestToken): Promise<User> {
    return this.authService.findOne(body.jwt.token);
  }
}
