import { User, UserRole } from '../../../domains/users/users.entity';
import { faker } from '@faker-js/faker';

export const admins: User[] = [
  {
    id: 'c63a4bd1-cabd-44ee-b911-9ee2533dd000',
    firstName: 'Adel',
    lastName: 'Sen',
    email: 'adel@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
  {
    id: 'c63a4bd1-cabd-44ee-b911-9ee2533dd001',
    firstName: 'Coraline',
    lastName: 'Esedji',
    email: 'coraline@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
  {
    id: 'c63a4bd1-cabd-44ee-b911-9ee2533dd002',
    firstName: 'Océane',
    lastName: 'Renoux',
    email: 'oceane@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
  {
    id: 'c63a4bd1-cabd-44ee-b911-9ee2533dd003',
    firstName: 'Thomas',
    lastName: 'Geoffron',
    email: 'thomas@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
];

const userRoles: UserRole[] = [
  ...Array(2).fill(UserRole.INSTRUCTOR),
  ...Array(3).fill(UserRole.ORGANIZER),
  ...Array(5).fill(UserRole.TECHNICIAN),
  ...Array(20).fill(UserRole.USER),
];

export const users: User[] = userRoles.map((role, index) => ({
  id: `c63a4bd1-cabd-44ee-b911-9ee2533dd0${String(index + 4).padStart(2, '0')}`,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: `${role}.${index + 4}@bng.fr`.toLowerCase(),
  password: 'password',
  role,
}));
