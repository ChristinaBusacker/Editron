import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { DatabaseModule } from '@database/database.module';
import { AssetProcessor } from './asset.processor';
import { ConfigModule } from '@nestjs/config';
import { AssetController } from './asset.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [AssetController],
  imports: [DatabaseModule, ConfigModule, AuthModule],
  providers: [AssetService, AssetProcessor],
  exports: [AssetService],
})
export class AssetModule {}
