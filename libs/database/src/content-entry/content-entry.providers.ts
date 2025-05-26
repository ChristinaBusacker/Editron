import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { ContentEntryEntity } from './content-entry.entity';

export const contentEntryProviders = [
  {
    provide: RepositoryKey.contentEntry,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContentEntryEntity),
    inject: ['DATA_SOURCE'],
  },
];
