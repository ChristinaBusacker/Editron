import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LocalizationEntity } from './localization/localization.entity';
import { PasswordResetEntity } from './password-reset/password-reset.entity';
import { SessionEntity } from './session/session.entity';
import { UserEntity } from './user/user.entity';
import { MigrationEntity } from './migration/migration.entity';
import { ProjectEntity } from './project/project.entity';
import { ProjectMemberEntity } from './project-member/project-member.entity';

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
    @Inject(RepositoryKey.migration)
    public readonly migrationRepository: Repository<MigrationEntity>,
    @Inject(RepositoryKey.project)
    public readonly projectRepository: Repository<ProjectEntity>,
    @Inject(RepositoryKey.projectMember)
    public readonly projectMemberRepository: Repository<ProjectMemberEntity>,
  ) {}
}
