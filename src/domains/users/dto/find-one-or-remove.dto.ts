import { IsString, IsUUID } from 'class-validator';

export class FindOneOrRemoveDto {
  @IsUUID()
  id: string;

  @IsString()
  token: string;
}
