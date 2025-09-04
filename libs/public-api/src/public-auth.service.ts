import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import { DatabaseService } from '@database/database.service';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class PublicAuthService {
  constructor(private readonly databaseService: DatabaseService) {}

  /** Returns token or null if invalid. */
  async validateApiKey(
    rawKey: string | undefined | null,
  ): Promise<ApiTokenEntity | null> {
    if (!rawKey?.trim()) return null;
    const key = rawKey.trim();

    const token = await this.databaseService.apiTokenRepository.findOne({
      where: { token: key },
      relations: { project: true },
    });
    if (!token) return null;

    return token;
  }
}
