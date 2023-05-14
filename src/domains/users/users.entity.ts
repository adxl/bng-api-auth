import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import { Role } from './role.entity';
import * as bcrypt from 'bcryptjs';

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

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column({ default: false })
  removed: boolean;

  @Column()
  created_at: Date;

  @BeforeInsert()
  async setCreatedAt(): Promise<void> {
    this.password = await bcrypt.hash(this.password, 10);
    this.created_at = new Date();
  }
}
