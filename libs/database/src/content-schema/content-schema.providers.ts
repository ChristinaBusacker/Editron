import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { ContentSchemaEntity } from './content-schema.entity';

export const contentSchemaProviders = [
  {
    provide: RepositoryKey.contentSchema,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContentSchemaEntity),
    inject: ['DATA_SOURCE'],
  },
];
