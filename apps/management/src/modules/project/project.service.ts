import { DatabaseService } from '@database/database.service';
import { ProjectEntity } from '@database/project/project.entity';
import { UserEntity } from '@database/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProjectService {
  constructor(private databaseService: DatabaseService) {}

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
