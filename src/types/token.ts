import { Type } from 'class-transformer';
import { IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { TokenDto } from 'src/domains/users/users.dto';

export class RequestToken {
  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;

  @IsUUID()
  @IsOptional()
  userId: string;
}
