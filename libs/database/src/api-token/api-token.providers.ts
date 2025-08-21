import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { ApiTokenEntity } from './api-token.entity';

export const apiTokenProviders = [
  {
    provide: RepositoryKey.apiToken,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ApiTokenEntity),
    inject: ['DATA_SOURCE'],
  },
];
