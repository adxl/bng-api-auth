import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { User, UserRole } from '../domains/users/users.entity';

export class RequestPayload {
  @IsUUID(4)
  @IsOptional()
  id?: string;

  @IsOptional()
  @IsUUID(4, { each: true })
  @ArrayNotEmpty()
  ids?: string[];

  @IsString()
  @IsOptional()
  token?: string;

  @IsOptional()
  roles?: UserRole[] | '*';

  @IsOptional()
  @ValidateNested()
  @Type(() => User)
  user?: User;
}
