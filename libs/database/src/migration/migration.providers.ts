import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { MigrationEntity } from './migration.entity';

export const migrationProviders = [
  {
    provide: RepositoryKey.migration,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MigrationEntity),
    inject: ['DATA_SOURCE'],
  },
];
