import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { User, UserRole } from '../domains/users/users.entity';

export class RequestPayload {
  @IsUUID(4)
  @IsOptional()
  id?: string;

  @IsUUID(4, { each: true })
  @IsOptional()
  ids?: string[];

  @IsString()
  @IsOptional()
  token?: string;

  @IsOptional()
  roles?: UserRole[] | '*';

  @IsOptional()
  @ValidateNested()
  @Type(() => User)
  user: User;
}
