import { Type } from 'class-transformer';
import { IsAlpha, IsEmail, IsNotEmptyObject, Length, ValidateNested } from 'class-validator';
import { RequestPayload } from '../../../types';

export class RegisterDto {
  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;

  @IsEmail()
  email: string;

  @Length(8, 64)
  password: string;
}

export class RegisterPayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => RegisterDto)
  body: RegisterDto;
}
