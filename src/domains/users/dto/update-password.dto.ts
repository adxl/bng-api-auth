import { IsString, IsStrongPassword, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(8)
  oldPwd: string;

  @IsStrongPassword()
  @MinLength(8)
  newPwd: string;

  @IsString()
  token: string;
}
