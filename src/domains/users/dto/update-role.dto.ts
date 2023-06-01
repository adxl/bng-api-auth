import { IsEnum, IsString, IsUUID } from 'class-validator';
import { UserRole } from '../users.entity';

export class UpdateUserRoleDto {
  @IsUUID()
  id: string;

  @IsEnum(UserRole, { each: true })
  role: UserRole;

  @IsString()
  token: string;
}
