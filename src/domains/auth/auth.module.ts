import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthHelper } from './auth.helper';
import { JwtStrategy } from './auth.strategy';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.service';
import { MailerHelper } from '../../helpers/mailer.helper';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy, ConfigService, UsersService, MailerHelper],
  exports: [AuthService],
})
export class AuthModule {}
