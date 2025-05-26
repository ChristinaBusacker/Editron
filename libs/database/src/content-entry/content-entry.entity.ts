import { ProjectEntity } from '@database/project/project.entity';
import { ContentSchemaEntity } from '@database/content-schema/content-schema.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Index,
} from 'typeorm';
import { UserEntity } from '@database/user/user.entity';

@Entity('content_entries')
@Index(['project', 'schema', 'key'], { unique: true })
export class ContentEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentSchemaEntity, { nullable: false })
  schema: ContentSchemaEntity;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE', nullable: false })
  project: ProjectEntity;

  @Column()
  key: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  updatedBy: UserEntity;
}
