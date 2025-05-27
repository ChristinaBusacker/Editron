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

@Injectable()
export class ProjectService {
  constructor(private databaseService: DatabaseService) {}

  getAll(user: UserEntity) {
    return this.databaseService.projectRepository
      .createQueryBuilder('project')
      .leftJoin('project.owner', 'owner')
      .leftJoin(ProjectMemberEntity, 'member', 'member.project = project.id')
      .leftJoin('member.user', 'memberUser')
      .where('owner.id = :userId', { userId: user.id })
      .orWhere('memberUser.id = :userId', { userId: user.id })
      .getMany();
  }

  async getProjectForUserOrThrow(
    projectId: string,
    userId: string,
  ): Promise<ProjectEntity> {
    const project = await this.databaseService.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .leftJoin(ProjectMemberEntity, 'member', 'member.project = project.id')
      .leftJoin('member.user', 'memberUser')
      .where('project.id = :projectId', { projectId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('owner.id = :userId', { userId }).orWhere(
            'memberUser.id = :userId',
            { userId },
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

  async create(name: string, owner: UserEntity): Promise<ProjectEntity> {
    const project = this.databaseService.projectRepository.create({
      name,
      owner,
    });
    return this.databaseService.projectRepository.save(project);
  }

  async updateName(id: string, name: string): Promise<ProjectEntity> {
    const project = await this.databaseService.projectRepository.findOneBy({
      id,
    });
    if (!project) throw new NotFoundException('Project not found');
    project.name = name;
    return this.databaseService.projectRepository.save(project);
  }

  async delete(id: string): Promise<void> {
    const result = await this.databaseService.projectRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('Project not found');
    }
  }
}
