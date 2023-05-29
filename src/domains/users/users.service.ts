import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;

  public async getAllUsers(): Promise<User[]> {
    const users: User[] | null = await this.userRepository.find({
      relations: { role: true },
      where: { removed: false },
    });
    if (!users) throw new NotFoundException('No users found!');
    return users;
  }

  public async getOneUser(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id,
        removed: false,
      },
    });

    if (!user) throw new NotFoundException('User not found!');

    return user;
  }

  public async updateRole(id: string, roleName: string): Promise<object> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id,
        removed: false,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const role: Role | null = await this.roleRepository.findOneBy({
      name: roleName,
    });

    if (!role) throw new NotFoundException("Role doesn't exist");

    user.role = role;

    await this.userRepository.save(user);

    return { statusCode: 200, message: 'User updated succesfully' };
  }

  public async removeUser(id: string): Promise<object> {
    const user: User | null = await this.userRepository.findOne({
      where: {
        id,
        removed: false,
      },
    });

    if (!user)
      throw new NotFoundException('User not found or already removed!');

    user.removed = true;

    await this.userRepository.save(user);

    return { statusCode: 200, message: 'User' };
  }
}
