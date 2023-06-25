import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { TypeOrmConfig } from '../../config/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserRole } from '../users/users.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

describe('Tests users', () => {
  let authController: AuthController;
  let jwtService: JwtService;
  let jwt = null;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmConfig),
        TypeOrmModule.forFeature([User]),
        AppModule,
        UsersModule,
        AuthModule,
      ],
      providers: [AuthService, UsersService, JwtService],
      controllers: [AuthController],
    }).compile();

    authController = module.get(AuthController);
    jwtService = module.get(JwtService);

    jwt = { token: 'Bearer ' + jwtService.sign({ id: '163a4bd1-cabd-44ee-b911-9ee2533dd003' }) };
  });

  describe('Test register', () => {
    it('should return the newly created user', async () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@bgn.fr',
        password: 'p4ssw0rd',
      };

      const user = await authController.register(data);
      expect(user.email).toBe('jdoe@bgn.fr');
    });
  });

  describe('Test login', () => {
    it('should return a JWT', async () => {
      const data = {
        email: 'jdoe@bgn.fr',
        password: 'p4ssw0rd',
      };

      const token = await authController.login(data);
      expect(typeof token).toBe('string');
    });

    it('should throws a not found exception', async () => {
      await expect(
        authController.login({
          email: 'someone@bgn.fr',
          password: 'test',
        }),
      ).rejects.toThrow();
    });
  });

  // describe('Test verify user role', () => {
  //   it('should return the roles validaiton', async () => {
  //     // const data = {
  //     //   body: {
  //     //     firstName: 'John',
  //     //     lastName: 'Snow',
  //     //     email: 'jsnow@bng.fr',
  //     //     role: UserRole.INSTRUCTOR,
  //     //   },
  //     //   jwt,
  //     // };
  //     // const user = await usersController.create(data);
  //     // expect(user.email).toBe('jsnow@bng.fr');
  //     expect(true);
  //   });
  // });

  describe('Test get current user', () => {
    it('should return the current user information', async () => {
      const data = { jwt };
      const user = await authController.me(data);

      expect(user.firstName).toBe('Thomas');
      expect(user.lastName).toBe('Geoffron');
      expect(user.role).toBe(UserRole.ADMINISTRATOR);
    });
  });
});
