import { DatabaseService } from '@database/database.service';
import { SessionEntity } from '@database/session/session.entity';
import { UserEntity } from '@database/user/user.entity';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SESSION_LIFETIME_MIN = parseInt(process.env.SESSION_LIFETIME_MIN || '60');

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.databaseService.userRepository.findOneBy({ email });
    console.log(user);
    if (!user || !user.password) return null;
    const match = await bcrypt.compare(password, user.password);
    console.log(match);
    return match ? user : null;
  }

  async validateSSO(
    provider: 'local' | 'google' | 'microsoft' | 'github',
    providerId: string,
    email: string,
    name: string,
  ): Promise<UserEntity> {
    let user = await this.databaseService.userRepository.findOneBy({
      provider,
      providerId,
    });
    if (!user) {
      user = this.databaseService.userRepository.create({
        provider,
        providerId,
        email,
        name,
      });
      await this.databaseService.userRepository.save(user);
    }
    return user;
  }

  async createSession(user: UserEntity): Promise<SessionEntity> {
    const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MIN * 60_000);
    const session = this.databaseService.sessionRepository.create({
      user,
      expiresAt,
    });
    return await this.databaseService.sessionRepository.save(session);
  }

  async getValidSession(id: string): Promise<SessionEntity | null> {
    const session = await this.databaseService.sessionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!session || new Date() > session.expiresAt) return null;

    session.expiresAt = new Date(Date.now() + SESSION_LIFETIME_MIN * 60_000);
    await this.databaseService.sessionRepository.save(session);

    return session;
  }

  async deleteSession(id: string): Promise<boolean> {
    const result = await this.databaseService.sessionRepository.delete({ id });
    return result.affected > 0;
  }
}
