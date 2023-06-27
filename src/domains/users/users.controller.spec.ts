import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../../app.module';
import { TypeOrmConfig } from '../../config/typeorm.config';
import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { User, UserRole } from './users.entity';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

// import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('Tests users', () => {
  let usersController: UsersController;
  let token = '';
  // let mailerService: DeepMocked<MailerService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(TypeOrmConfig),
        TypeOrmModule.forFeature([User]),
        AppModule,
        UsersModule,
        AuthModule,
      ],
      providers: [
        UsersService,
        JwtService,
        // {
        //   provide: MailerService,
        //   useValue: createMock<MailerService>(),
        // },
      ],
      controllers: [UsersController],
    }).compile();

    token = 'Bearer ' + module.get(JwtService).sign({ id: '163a4bd1-cabd-44ee-b911-9ee2533dd000' });
    usersController = module.get(UsersController);
  });

  describe('Test find all users', () => {
    it('should return all users', async () => {
      const users = await usersController.findAll();
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('Test find one user', () => {
    it('should return one user', async () => {
      const user = await usersController.findOne({
        id: '163a4bd1-cabd-44ee-b911-9ee2533dd000',
        token,
      });
      expect(user.firstName).toEqual('Adel');
      expect(user.lastName).toEqual('Sen');
    });
    it('should throws a not found exception', async () => {
      await expect(
        usersController.findOne({
          id: 'c63a4bd1-cabd-44ee-b911-9ee2533dd050',
          token,
        }),
      ).rejects.toThrow();
    });
  });

  describe('Test create a user', () => {
    it('should return the new user email', async () => {
      const data = {
        token,
        body: {
          firstName: 'John',
          lastName: 'Snow',
          email: 'jsnow@bng.fr',
          role: UserRole.INSTRUCTOR,
        },
      };

      const user = await usersController.create(data);
      expect(user.email).toBe('jsnow@bng.fr');
    });
  });

  describe('Test update user password', () => {
    it('should return the number of affected resources', async () => {
      // mailerService.sendMail.mockResolvedValue(true);

      const data = {
        body: {
          oldPwd: 'password',
          password: 'new-password',
        },
        token,
      };
      expect((await usersController.updatePassword(data)).affected).toEqual(1);
    });
  });

  describe('Test update user profile', () => {
    it('should return the number of affected resources', async () => {
      const data = {
        body: {
          firstName: 'John',
        },
        token,
      };
      expect((await usersController.updateProfile(data)).affected).toEqual(1);
    });
  });

  describe('Test update user role', () => {
    it('should return the number of affected resources', async () => {
      const data = {
        id: 'c63a4bd1-cabd-44ee-b911-9ee2533dd006',
        body: {
          role: UserRole.TECHNICIAN,
        },
        token,
      };
      expect((await usersController.updateRole(data)).affected).toEqual(1);
    });
  });

  describe('Test remove one user', () => {
    it('should return the number of affected resources', async () => {
      const data = {
        id: 'c63a4bd1-cabd-44ee-b911-9ee2533dd017',
        token,
      };
      expect((await usersController.remove(data)).affected).toEqual(1);
    });
  });
});
