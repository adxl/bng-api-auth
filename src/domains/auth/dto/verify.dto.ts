import { IsArray, IsString } from 'class-validator';
import { UserRole } from 'src/domains/users/users.entity';

export class VerifyDto {
  @IsString()
  token: string;

  @IsArray()
  roles: Array<UserRole | '*'>;
}
