import { Module } from '@nestjs/common';
import { databaseProviders } from '../database.providers';
import { assetProviders } from './asset.providers';


@Module({
  providers: [...assetProviders, ...databaseProviders],
  exports: [...assetProviders, ...databaseProviders],
})
export class AssetTableModule {}
