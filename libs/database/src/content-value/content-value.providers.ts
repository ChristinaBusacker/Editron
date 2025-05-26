import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { ContentValueEntity } from './content-value.entity';

export const contentValueProviders = [
  {
    provide: RepositoryKey.contentValue,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContentValueEntity),
    inject: ['DATA_SOURCE'],
  },
];
