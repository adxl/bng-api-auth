import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { TokenDto } from 'src/domains/users/users.dto';
import { UserRole } from 'src/domains/users/users.entity';

export class VerifyDto {
  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;

  @IsArray()
  roles: Array<UserRole | '*'>;
}
