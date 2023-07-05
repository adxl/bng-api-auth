import { User, UserRole } from '../../../domains/users/users.entity';
import { faker } from '@faker-js/faker';

export const admins: User[] = [
  {
    id: '163a4bd1-cabd-44ee-b911-9ee2533dd000',
    firstName: 'Adel',
    lastName: 'Sen',
    email: 'adel@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
    caps: 0,
  },
  {
    id: '163a4bd1-cabd-44ee-b911-9ee2533dd001',
    firstName: 'Coraline',
    lastName: 'Esedji',
    email: 'coraline@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
    caps: 0,
  },
  {
    id: '163a4bd1-cabd-44ee-b911-9ee2533dd002',
    firstName: 'Océane',
    lastName: 'Renoux',
    email: 'oceane@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
    caps: 0,
  },
  {
    id: '163a4bd1-cabd-44ee-b911-9ee2533dd003',
    firstName: 'Thomas',
    lastName: 'Geoffron',
    email: 'thomas@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
    caps: 0,
  },

  {
    id: '163a4bd1-cabd-44ee-b911-9ee2533dd004',
    firstName: 'Adrien',
    lastName: 'Morin',
    email: 'technician@bng.fr',
    password: 'password',
    role: UserRole.TECHNICIAN,
    caps: 0,
  },
  {
    id: '163a4bd1-cabd-44ee-b911-9ee2533dd005',
    firstName: 'Yves',
    lastName: 'Skrzypczyk',
    email: 'instructor@bng.fr',
    password: 'password',
    role: UserRole.INSTRUCTOR,
    caps: 0,
  },
  {
    id: '163a4bd1-cabd-44ee-b911-9ee2533dd006',
    firstName: 'Karl',
    lastName: 'Marques Bernardo',
    email: 'organizer@bng.fr',
    password: 'password',
    role: UserRole.ORGANIZER,
    caps: 0,
  },
];

const userRoles: UserRole[] = [...Array(20).fill(UserRole.USER)];

export const users: User[] = userRoles.map((role, index) => ({
  id: `c63a4bd1-cabd-44ee-b911-9ee2533dd0${String(index + 1).padStart(2, '0')}`,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: `${role}.${index + 1}@bng.fr`.toLowerCase(),
  password: 'password',
  role,
  caps: faker.number.int({ min: 100, max: 600 }),
}));
