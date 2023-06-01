import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'USER',
  TECHNICIAN = 'TECHNICIAN',
  HOST = 'HOST',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
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
  removed: boolean;

  @Column()
  created_at: Date;

  @BeforeInsert()
  async setCreatedAt(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
    this.created_at = new Date();
  }
}
