import { User } from '../../../domains/users/users.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { admins, users } from './users.data';

export class UserSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    await dataSource.synchronize(true);

    const usersData: User[] = dataSource.manager.getRepository(User).create([...admins, ...users]);

    await dataSource.manager.getRepository(User).insert([...usersData]);
  }
}
