import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { LocalizationEntity } from './localization.entity';

export const localizationProviders = [
  {
    provide: RepositoryKey.localization,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(LocalizationEntity),
    inject: ['DATA_SOURCE'],
  },
];
