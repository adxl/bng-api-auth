import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsNotEmptyObject,
  IsOptional,
  IsStrongPassword,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { UserRole } from './users.entity';
import { Type } from 'class-transformer';
import { RequestPayload } from '../../types';

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
}

export class UpdateProfilePayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  body: UpdateProfileDto;
}

//---

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateRolePayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateRoleDto)
  body: UpdateRoleDto;
}
