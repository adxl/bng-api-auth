import { User, UserRole } from '../../../domains/users/users.entity';
import { faker } from '@faker-js/faker';

export const admins: User[] = [
  {
    id: '33c7f28e-bab3-439d-965d-0522568b0ec6',
    firstName: 'Adel',
    lastName: 'S',
    email: 'adel@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
  {
    id: '33c7f28e-bab3-439d-965d-0522568b0ec7',
    firstName: 'Coraline',
    lastName: 'E',
    email: 'coraline@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
  {
    id: '33c7f28e-bab3-439d-965d-0522568b0ec8',
    firstName: 'Océane',
    lastName: 'R',
    email: 'oceane@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
  {
    id: '33c7f28e-bab3-439d-965d-0522568b0ec9',
    firstName: 'Thomas',
    lastName: 'G',
    email: 'thomas@bng.fr',
    password: 'password',
    role: UserRole.ADMINISTRATOR,
  },
];

export const users: User[] = Array.from({
  length: 25,
}).map(() => {
  return {
    id: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'password',
    role: faker.helpers.arrayElement(Object.values(UserRole).filter((role) => role != UserRole.ADMINISTRATOR)),
  };
});
