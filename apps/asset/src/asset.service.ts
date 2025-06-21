import { DatabaseService } from '@database/database.service';
import { AssetEntity } from '@database/asset/asset.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetService {
  constructor(private readonly db: DatabaseService) {}

  async create(asset: Partial<AssetEntity>): Promise<AssetEntity> {
    const newAsset = this.db.assetRepository.create(asset);
    return this.db.assetRepository.save(newAsset);
  }

  async findById(id: string): Promise<AssetEntity | null> {
    return this.db.assetRepository.findOne({ where: { id } });
  }

  async findByHash(hash: string): Promise<AssetEntity | null> {
    return this.db.assetRepository.findOne({ where: { hash } });
  }

  async findAll(): Promise<AssetEntity[]> {
    return this.db.assetRepository.find();
  }

  async deleteById(id: string): Promise<void> {
    await this.db.assetRepository.delete(id);
  }
}
