import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { RequestPayload } from 'src/types';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class LoginPayload extends RequestPayload {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => LoginDto)
  body: LoginDto;
}
