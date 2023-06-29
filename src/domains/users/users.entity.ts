import { Exclude, Expose } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'USER',
  TECHNICIAN = 'TECHNICIAN',
  ORGANIZER = 'ORGANIZER',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Expose({ groups: ['admin'] })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  @Exclude()
  removed?: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @BeforeInsert()
  async setCreatedAt?(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
