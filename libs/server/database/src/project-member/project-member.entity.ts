import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { ProjectEntity } from '../project/project.entity';
import { UserEntity } from '../user/user.entity';

@Entity('project_members')
@Unique(['project', 'user'])
export class ProjectMemberEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProjectEntity, project => project.id, {
    onDelete: 'CASCADE',
  })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, user => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;
}
