import { Role } from '../role.entity';

export class UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;
  removed: boolean;
  createdAt: Date;
}
