import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';

export class UpdateUserRoleDto {
  @IsUUID()
  id: string;

  @IsIn([
    'UTILISATEUR',
    'TECHNICIEN',
    'ANIMATEUR',
    'INSTRUCTEUR',
    'ADMINISTRATEUR',
  ])
  role:
    | 'UTILISATEUR'
    | 'TECHNICIEN'
    | 'ANIMATEUR'
    | 'INSTRUCTEUR'
    | 'ADMINISTRATEUR';
}
