import { ContentSchemaEntity } from '@database/content-schema/content-schema.entity';
import { ContentVersionEntity } from '@database/content-version/content-version.entity';
import { ProjectEntity } from '@database/project/project.entity';
import { UserEntity } from '@database/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('content_entries')
export class ContentEntryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  inBin: boolean;

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
