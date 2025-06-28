import { DatabaseService } from '@database/database.service';
import { ProjectMemberEntity } from '@database/project-member/project-member.entity';
import { ProjectEntity } from '@database/project/project.entity';
import { UserEntity } from '@database/user/user.entity';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Brackets } from 'typeorm';
import { CreateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(private databaseService: DatabaseService) {}

  getAll(user: UserEntity) {
    return this.databaseService.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoin(ProjectMemberEntity, 'member', 'member.project = project.id')
      .leftJoin('member.user', 'memberUser')
      .where('owner.id = :userId', { userId: user.id })
      .orWhere('memberUser.id = :userId', { userId: user.id })
      .orderBy('project.createdAt', 'DESC')
      .getMany();
  }

  async getProjectForUserOrThrow(
    projectId: string,
    user: UserEntity,
  ): Promise<ProjectEntity> {
    const project = await this.databaseService.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoin(ProjectMemberEntity, 'member', 'member.project = project.id')
      .leftJoin('member.user', 'memberUser')
      .where('project.id = :projectId', { projectId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('owner.id = :userId', { userId: user.id }).orWhere(
            'memberUser.id = :userId',
            { userId: user.id },
          );
        }),
      )
      .getOne();

    if (!project) {
      const exists = await this.databaseService.projectRepository.findOne({
        where: { id: projectId },
      });
      if (!exists) {
        throw new NotFoundException('Project not found');
      }
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async getProjectStatistics(projectId: string) {
    const entryRepo = this.databaseService.contentEntryRepository;
    const versionRepo = this.databaseService.contentVersionRepository;

    // Total entries
    const totalEntries = await entryRepo.count({
      where: { project: { id: projectId } },
    });

    // All versions for this project
    const allVersions = await versionRepo
      .createQueryBuilder('version')
      .innerJoinAndSelect('version.entry', 'entry')
      .innerJoinAndSelect('entry.schema', 'schema')
      .leftJoinAndSelect('version.createdBy', 'createdBy')
      .where('entry.projectId = :projectId', { projectId })
      .orderBy('version.createdAt', 'DESC')
      .getMany();

    const publishedCount = allVersions.filter((v) => v.isPublished).length;
    const unpublishedCount = allVersions.length - publishedCount;

    const lastVersion = allVersions[0];

    // Changes by date (for heatmap)
    const changesByDate: Record<string, number> = {};
    for (const version of allVersions) {
      const dateStr = version.createdAt.toISOString().slice(0, 10);
      changesByDate[dateStr] = (changesByDate[dateStr] || 0) + 1;
    }

    // Entries per schema/module
    const entriesPerSchemaRaw = await entryRepo
      .createQueryBuilder('entry')
      .select('schema.slug', 'slug')
      .addSelect('COUNT(*)', 'count')
      .innerJoin('entry.schema', 'schema')
      .where('entry.projectId = :projectId', { projectId })
      .groupBy('schema.slug')
      .orderBy('count', 'DESC')
      .getRawMany();

    const entriesPerSchema = entriesPerSchemaRaw.map((row) => ({
      schema: row.slug,
      count: parseInt(row.count, 10),
    }));

    return {
      totalEntries,
      publishedVersions: publishedCount,
      unpublishedVersions: unpublishedCount,
      lastUpdatedAt: lastVersion?.createdAt ?? null,
      lastUpdatedEntryId: lastVersion?.entry.id ?? null,
      lastUpdatedBy: lastVersion?.createdBy
        ? {
            id: lastVersion.createdBy.id,
            name: lastVersion.createdBy.name,
          }
        : null,
      lastUpdatedModule: lastVersion.entry.schema.slug,
      changesByDate,
      entriesPerSchema,
    };
  }

  async create(
    dto: CreateProjectDto,
    owner: UserEntity,
  ): Promise<ProjectEntity> {
    const project = this.databaseService.projectRepository.create({
      ...dto,
      owner,
    });
    return this.databaseService.projectRepository.save(project);
  }

  async update(id: string, dto: CreateProjectDto): Promise<ProjectEntity> {
    const project = await this.databaseService.projectRepository.findOneBy({
      id,
    });
    if (!project) throw new NotFoundException('Project not found');

    project.name = dto.name;
    project.settings = dto.settings;

    return this.databaseService.projectRepository.save(project);
  }

  async delete(id: string): Promise<void> {
    const result = await this.databaseService.projectRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
