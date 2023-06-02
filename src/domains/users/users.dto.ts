import {
  IsAlpha,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from './users.entity';
import { Type } from 'class-transformer';

export class TokenDto {
  @IsString()
  token: string;
}

export class FindOneDto {
  @IsUUID()
  id: string;

  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;
}

export class RemoveDto {
  @IsUUID()
  id: string;

  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;
}

export class UpdatePasswordDto {
  @MinLength(8)
  oldPwd: string;

  @IsStrongPassword()
  @MinLength(8)
  password: string;

  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;
}

export class UpdateProfileDto {
  @IsAlpha()
  @IsOptional()
  firstName?: string;

  @IsAlpha()
  @IsOptional()
  lastName?: string;

  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;
}

export class UpdateRoleDto {
  @IsUUID()
  id: string;

  @IsEnum(UserRole)
  role: UserRole;

  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;
}
