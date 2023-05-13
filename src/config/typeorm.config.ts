import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const IS_LOCAL: boolean = process.env.STAGE === 'local';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [],
  synchronize: IS_LOCAL,
};
