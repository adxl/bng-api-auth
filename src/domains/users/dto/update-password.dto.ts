import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ type: String, example: 'password' })
  @Length(8)
  oldPwd: string;

  @ApiProperty({ type: String, example: 'Password#0' })
  @IsStrongPassword()
  @Length(8)
  newPwd: string;
}
