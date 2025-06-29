import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { UserEntity } from '@database/user/user.entity';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserFromInviteDto,
  CreateUserInviteDto,
  UpdateUserInviteDto,
} from './dto/user.dto';
import { SessionEntity } from '@database/session/session.entity';
import { UserInviteEntity } from '@database/user-invite/user-invite.entity';

const SESSION_LIFETIME_MIN = parseInt(process.env.SESSION_LIFETIME_MIN || '60');
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

  async getInvite(inviteCode: string): Promise<UserInviteEntity> {
    const invite = await this.databaseService.userInviteRepository.findOne({
      where: { inviteCode, activated: false },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    const isExpired =
      Date.now() - invite.createdAt.getTime() > 1000 * 60 * 60 * 24;

    if (isExpired || invite.activated) {
      throw new BadRequestException('Invite is expired or already used');
    }

    return invite;
  }

  async renewInvite(id: string): Promise<UserInviteEntity> {
    const invite = await this.databaseService.userInviteRepository.findOne({
      where: { id },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    invite.createdAt = new Date();
    return await this.databaseService.userInviteRepository.save(invite);
  }

  async createInvite(dto: CreateUserInviteDto): Promise<UserInviteEntity> {
    const invite = this.databaseService.userInviteRepository.create({
      email: dto.email,
      name: dto.name,
      language: dto.language || 'de',
      permissions: dto.permissions || [],
    });

    return await this.databaseService.userInviteRepository.save(invite);
  }

  async createFromInvite(
    inviteCode: string,
    dto: CreateUserFromInviteDto,
  ): Promise<SessionEntity> {
    const invite = await this.getInvite(inviteCode);

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.databaseService.userRepository.create({
      email: invite.email,
      name: invite.name,
      language: invite.language,
      password: hashedPassword,
      permissions: invite.permissions,
      activated: true,
    });

    const savedUser = await this.databaseService.sessionRepository.save(user);

    // Mark invite as used
    invite.activated = true;
    await this.databaseService.userInviteRepository.save(invite);

    const expiresAt = new Date(Date.now() + SESSION_LIFETIME_MIN * 60_000);

    // Create session
    const session = this.databaseService.sessionRepository.create({
      user: savedUser,
      expiresAt,
    });

    return await this.databaseService.sessionRepository.save(session);
  }

  async updateInvite(
    id: string,
    dto: UpdateUserInviteDto,
  ): Promise<UserInviteEntity> {
    const invite = await this.databaseService.userInviteRepository.findOne({
      where: { id },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    Object.assign(invite, {
      ...dto,
    });

    return await this.databaseService.userInviteRepository.save(invite);
  }

  async listInvites(): Promise<UserInviteEntity[]> {
    return await this.databaseService.userInviteRepository.find();
  }

  async delete(id: string): Promise<void> {
    const result = await this.databaseService.userRepository.delete({ id });
    if (result.affected === 0) throw new NotFoundException('User not found');
  }

  async list(): Promise<
    Pick<UserEntity, 'id' | 'name' | 'email' | 'provider'>[]
  > {
    const users = await this.databaseService.userRepository.find();
    return users.map(
      ({ id, name, email, provider, language, permissions }) => ({
        id,
        name,
        email,
        provider,
        language,
        permissions,
      }),
    );
  }
}
