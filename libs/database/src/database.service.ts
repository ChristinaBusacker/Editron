import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LocalizationEntity } from './localization/localization.entity';
import { PasswordResetEntity } from './password-reset/password-reset.entity';
import { SessionEntity } from './session/session.entity';
import { UserEntity } from './user/user.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(RepositoryKey.user)
    public readonly userRepository: Repository<UserEntity>,
    @Inject(RepositoryKey.passwordReset)
    public readonly passwordResetRepository: Repository<PasswordResetEntity>,
    @Inject(RepositoryKey.session)
    public readonly sessionRepository: Repository<SessionEntity>,
    @Inject(RepositoryKey.localization)
    public readonly localizationRepository: Repository<LocalizationEntity>,
  ) {}
}
