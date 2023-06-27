import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from './users.entity';
import { Type } from 'class-transformer';
import { RequestPayload } from 'src/types';

export class CreateUserDto {
  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class CreateUserPayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  body: CreateUserDto;
}

// ---

export class UpdatePasswordDto {
  @MinLength(8)
  oldPwd: string;

  @IsStrongPassword()
  @MinLength(8)
  password: string;

  @IsString()
  token: string;
}

export class UpdatePasswordPayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdatePasswordDto)
  body: UpdatePasswordDto;
}

// ---

export class UpdateProfileDto {
  @IsAlpha()
  @IsOptional()
  firstName?: string;

  @IsAlpha()
  @IsOptional()
  lastName?: string;

  @IsString()
  token: string;
}

export class UpdateProfilePayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  body: UpdateProfileDto;
}

//---

export class UpdateRoleDto {
  @IsUUID()
  id: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  token: string;
}

export class UpdateRolePayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateRoleDto)
  body: UpdateRoleDto;
}
