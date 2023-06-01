import { UserRole } from '../users.entity';

export class UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  removed: boolean;
  createdAt: Date;
}
