import {
  ClassSerializerInterceptor,
  Controller,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../users/users.entity';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @EventPattern('register')
  @UseInterceptors(ClassSerializerInterceptor)
  public register(data: RegisterDto): Promise<User> {
    return this.authService.register(data);
  }

  @EventPattern('login')
  public login(data: LoginDto): Promise<string> {
    return this.authService.login(data);
  }
}
