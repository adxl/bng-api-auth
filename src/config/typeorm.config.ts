import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Role } from 'src/domains/users/role.entity';
import { User } from 'src/domains/users/users.entity';

const IS_LOCAL: boolean = process.env.STAGE === 'local';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Role],
  synchronize: IS_LOCAL,
  ssl: !IS_LOCAL,
  extra: IS_LOCAL
    ? {}
    : {
        ssl: {
          rejectUnauthorized: false,
        },
      },
};
