import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { UserEntity } from '@database/user/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    name: string,
    email: string,
    password?: string,
  ): Promise<UserEntity> {
    const user = this.databaseService.userRepository.create({
      name,
      email,
      password: password ? await bcrypt.hash(password, 10) : undefined,
      activated: true,
    });
    return this.databaseService.userRepository.save(user);
  }

  async update(
    id: string,
    data: Partial<Pick<UserEntity, 'name' | 'email' | 'password'>>,
  ): Promise<UserEntity> {
    const user = await this.databaseService.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User not found');

    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;

    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    return this.databaseService.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    const result = await this.databaseService.userRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async list(): Promise<
    Pick<UserEntity, 'id' | 'name' | 'email' | 'provider'>[]
  > {
    const users = await this.databaseService.userRepository.find();
    return users.map(({ id, name, email, provider }) => ({
      id,
      name,
      email,
      provider,
    }));
  }
}
