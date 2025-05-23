import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { ProjectEntity } from './project.entity';

export const projectProviders = [
  {
    provide: RepositoryKey.project,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProjectEntity),
    inject: ['DATA_SOURCE'],
  },
];
