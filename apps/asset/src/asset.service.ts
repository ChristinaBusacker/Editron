import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { AssetEntity } from '@database/asset/asset.entity';

@Injectable()
export class AssetService {
  constructor(private readonly db: DatabaseService) {}

  async create(asset: Partial<AssetEntity>): Promise<AssetEntity> {
    const newAsset = this.db.assetRepository.create(asset);
    return this.db.assetRepository.save(newAsset);
  }

  async findById(id: string): Promise<AssetEntity | null> {
    return this.db.assetRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
  }

  async findByIdWithUser(id: string): Promise<AssetEntity | null> {
    return this.db.assetRepository.findOne({
      where: { id },
      relations: ['uploadedBy'],
    });
  }

  async findAll(): Promise<AssetEntity[]> {
    return this.db.assetRepository.find();
  }

  async findAllWithUser(): Promise<AssetEntity[]> {
    return this.db.assetRepository.find({
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' },
    });
  }

  async findByHash(hash: string): Promise<AssetEntity | null> {
    return this.db.assetRepository.findOne({ where: { hash } });
  }

  async deleteById(id: string): Promise<void> {
    await this.db.assetRepository.delete(id);
  }
}
