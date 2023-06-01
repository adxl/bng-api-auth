import { IsAlpha, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsAlpha()
  firstName?: string;

  @IsAlpha()
  lastName?: string;

  @IsString()
  token: string;
}
