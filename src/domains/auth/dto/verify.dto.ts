import { IsEnum, IsString } from 'class-validator';
import { UserRole } from 'src/domains/users/users.entity';

export class VerifyDto {
  @IsString()
  token: string;

  @IsEnum(UserRole)
  role: UserRole;
}
