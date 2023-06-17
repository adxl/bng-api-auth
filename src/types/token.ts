import { IsOptional, IsString, IsUUID } from 'class-validator';

export class RequestToken {
  @IsString()
  token: string;

  @IsUUID()
  @IsOptional()
  userId: string;
}
