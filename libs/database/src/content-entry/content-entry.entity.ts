import { ProjectEntity } from '@database/project/project.entity';
import { ContentSchemaEntity } from '@database/content-schema/content-schema.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  Index,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '@database/user/user.entity';
import { ContentVersionEntity } from '@database/content-version/content-version.entity';

@Entity('content_entries')
@Index(['project', 'schema'], { unique: true })
export class ContentEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ContentSchemaEntity, { nullable: false })
  schema: ContentSchemaEntity;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE', nullable: false })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  updatedBy: UserEntity;

  @OneToMany(() => ContentVersionEntity, version => version.entry)
  versions: ContentVersionEntity[];
}
