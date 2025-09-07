import { DataSource } from 'typeorm';
import { ProjectMemberEntity } from './project-member.entity';
import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';

export const projectMemberProviders = [
  {
    provide: RepositoryKey.projectMember,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProjectMemberEntity),
    inject: ['DATA_SOURCE'],
  },
];
