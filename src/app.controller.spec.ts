import { INestMicroservice } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfig } from './config/typeorm.config';

import { bootstrap } from './main';
import { AuthModule } from './domains/auth/auth.module';
import { UsersModule } from './domains/users/users.module';
import { AppModule } from './app.module';

describe('Tests entrypoint', () => {
  let appController: AppController;
  let appInstance: INestMicroservice;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TypeOrmConfig), AppModule, UsersModule, AuthModule],
      providers: [AppService],
      controllers: [AppController],
    }).compile();

    appController = module.get(AppController);
    appInstance = await bootstrap();
  });

  afterAll((done) => {
    appInstance.close();
    done();
  });

  describe('Start the server', () => {
    it('it should start the server', () => {
      expect(appInstance).toBeDefined();
    });
  });

  describe('Test call index', () => {
    it('should return a welcome string', () => {
      expect(appController.index()).toEqual('Welcome to Auth API');
    });
  });

  describe('Test kill', () => {
    it('should return exception ServiceUnavailableException', () => {
      expect(() => appController.kill()).toThrow();
    });
  });
});
