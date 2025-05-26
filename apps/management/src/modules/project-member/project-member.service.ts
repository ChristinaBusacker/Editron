import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { UserEntity } from '@database/user/user.entity';
import { ProjectEntity } from '@database/project/project.entity';

@Injectable()
export class ProjectMemberService {
  constructor(private readonly db: DatabaseService) {}

  async addUserToProject(projectId: string, userId: string) {
    const project = await this.db.projectRepository.findOneBy({
      id: projectId,
    });
    const user = await this.db.userRepository.findOneBy({ id: userId });

    if (!project || !user)
      throw new NotFoundException('Project or user not found');

    const exists = await this.db.projectMemberRepository.findOneBy({
      project,
      user,
    });
    if (exists) return exists;

    const member = this.db.projectMemberRepository.create({ project, user });
    return this.db.projectMemberRepository.save(member);
  }

  async removeUserFromProject(projectId: string, userId: string) {
    const project = await this.db.projectRepository.findOneBy({
      id: projectId,
    });
    const user = await this.db.userRepository.findOneBy({ id: userId });
    if (!project || !user)
      throw new NotFoundException('Project or user not found');

    const deleted = await this.db.projectMemberRepository.delete({
      project,
      user,
    });
    if (deleted.affected === 0)
      throw new NotFoundException('Membership not found');
  }

  async getUsersForProject(
    projectId: string,
  ): Promise<{ id: string; name: string; email: string; provider: string }[]> {
    const members = await this.db.projectMemberRepository.find({
      where: { project: { id: projectId } },
      relations: ['user'],
    });

    return members.map((member) => {
      const u = member.user;
      return { id: u.id, name: u.name, email: u.email, provider: u.provider };
    });
  }
}
