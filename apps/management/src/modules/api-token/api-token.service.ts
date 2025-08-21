import { ApiTokenEntity } from '@database/api-token/api-token.entity';
import { DatabaseService } from '@database/database.service';
import { UserEntity } from '@database/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApiTokenDto } from './dto/api-token.dto';

@Injectable()
export class ApiTokenService {
  constructor(private readonly databaseService: DatabaseService) {}

  async get(id: string): Promise<ApiTokenEntity> {
    return await this.databaseService.apiTokenRepository.findOne({
      where: { id },
    });
  }

  async list(projectId: string): Promise<ApiTokenEntity[]> {
    return await this.databaseService.apiTokenRepository.find({
      where: { project: { id: projectId } },
    });
  }

  async create(
    dto: CreateApiTokenDto,
    user: UserEntity,
  ): Promise<ApiTokenEntity> {
    const {
      project,
      hasManagementAccess,
      hasReadAccess,
      hasWriteAccess,
      settings,
    } = dto;

    const projectEntity = await this.databaseService.projectRepository.findOne({
      where: { id: project },
    });
    if (!projectEntity)
      throw new NotFoundException(`Project "${project}" not found`);

    const apiToken = this.databaseService.apiTokenRepository.create({
      project: projectEntity,
      hasManagementAccess,
      hasReadAccess,
      hasWriteAccess,
      settings,
      createdBy: user,
      updatedBy: user,
    });

    return this.databaseService.apiTokenRepository.save(apiToken);
  }

  async delete(id: string): Promise<void> {
    const result = await this.databaseService.apiTokenRepository.delete({ id });
    if (result.affected === 0)
      throw new NotFoundException('ApiToken not found');
  }
}
