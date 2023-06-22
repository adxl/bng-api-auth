import { Type } from 'class-transformer';
import { IsAlpha, IsEmail, IsEnum, ValidateNested } from 'class-validator';
import { TokenDto } from 'src/domains/users/users.dto';
import { UserRole } from 'src/domains/users/users.entity';

export class RegisterDto {
  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;

  @IsEmail()
  email: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class RegisterDtoWrapper {
  @ValidateNested()
  @Type(() => TokenDto)
  jwt: TokenDto;

  @ValidateNested()
  @Type(() => RegisterDto)
  body: RegisterDto;
}
