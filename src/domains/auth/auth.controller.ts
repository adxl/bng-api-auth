import { ClassSerializerInterceptor, Controller, Inject, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { RegisterPayload } from './dto/register.dto';
import { LoginPayload } from './dto/login.dto';
import { User } from '../users/users.entity';
import { RequestPayload } from '../../types';

@Controller()
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @EventPattern('auth.register')
  @UseInterceptors(ClassSerializerInterceptor)
  public register(@Payload() payload: RegisterPayload): Promise<User> {
    return this.authService.register(payload.body);
  }

  @EventPattern('auth.login')
  public login(@Payload() payload: LoginPayload): Promise<string> {
    return this.authService.login(payload.body);
  }

  @EventPattern('auth.verify')
  public verify(@Payload() payload: RequestPayload): Promise<string> {
    return this.authService.verify(payload);
  }

  @EventPattern('auth.me')
  @SerializeOptions({ groups: ['me'] })
  public me(@Payload() payload: RequestPayload): Promise<User> {
    return this.authService.findOne(payload.token);
  }
}
