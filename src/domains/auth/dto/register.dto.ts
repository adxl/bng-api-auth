import { IsAlpha, IsEmail, Length } from 'class-validator';

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
