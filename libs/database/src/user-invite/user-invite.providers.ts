import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { UserInviteEntity } from './user-invite.entity';

export const userInviteProviders = [
  {
    provide: RepositoryKey.userInvite,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserInviteEntity),
    inject: ['DATA_SOURCE'],
  },
];
