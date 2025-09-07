import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { PasswordResetEntity } from './password-reset.entity';

export const passwordResetProviders = [
  {
    provide: RepositoryKey.passwordReset,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PasswordResetEntity),
    inject: ['DATA_SOURCE'],
  },
];
