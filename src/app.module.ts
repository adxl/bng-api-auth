import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfig } from './config/typeorm.config';
import { UsersModule } from './domains/users/users.module';
import { AuthModule } from './domains/auth/auth.module';

@Module({
  imports: [UsersModule, AuthModule, TypeOrmModule.forRoot(TypeOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
