import { User } from '../domains/users/users.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { UserSeeder } from './seeds/users/users.seeder';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User],
  seeds: [UserSeeder],
};

export const AppDataSource = new DataSource(options);
