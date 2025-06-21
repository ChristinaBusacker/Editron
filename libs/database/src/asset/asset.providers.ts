import { RepositoryKey } from '@database/declaration/enums/repositoryKey.enum';
import { DataSource } from 'typeorm';
import { AssetEntity } from './asset.entity';

export const assetProviders = [
  {
    provide: RepositoryKey.asset,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(AssetEntity),
    inject: ['DATA_SOURCE'],
  },
];
