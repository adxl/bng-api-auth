import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthHelper } from '../auth/auth.helper';
import { JwtStrategy } from '../auth/auth.strategy';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { MailerHelper } from 'src/helpers/mailer.helper';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_KEY'),
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService, AuthHelper, JwtStrategy, ConfigService, AuthService, MailerHelper, AuthGuard],
  controllers: [UsersController],
})
export class UsersModule {}
