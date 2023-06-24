import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../users/users.entity';
import { TokenDto } from '../../users/users.dto';

export class VerifyDto {
  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;

  @IsArray()
  roles: UserRole[] | '*';
}
