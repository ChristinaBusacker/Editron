import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { ErrorLogEntity } from './error-log.entity';

export const errorLogProviders = [
  {
    provide: RepositoryKey.errorLog,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ErrorLogEntity),
    inject: ['DATA_SOURCE'],
  },
];
