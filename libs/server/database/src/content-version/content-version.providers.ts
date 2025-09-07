import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { ContentVersionEntity } from './content-version.entity';

export const contentVersionProviders = [
  {
    provide: RepositoryKey.contentVersion,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContentVersionEntity),
    inject: ['DATA_SOURCE'],
  },
];
