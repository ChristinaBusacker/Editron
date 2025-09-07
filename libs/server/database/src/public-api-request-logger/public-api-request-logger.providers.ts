import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { PublicApiRequestLogEntity } from './public-api-request-logger.entity';

export const publicApiRequestLogProviders = [
  {
    provide: RepositoryKey.publicApiRequestLog,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(PublicApiRequestLogEntity),
    inject: ['DATA_SOURCE'],
  },
];
