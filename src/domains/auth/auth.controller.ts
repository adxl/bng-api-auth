import { Controller, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @EventPattern('register')
  public register(data: RegisterDto) {
    return this.authService.register(data);
  }

  @EventPattern('login')
  public login(data: LoginDto) {
    return this.authService.login(data);
  }
}
