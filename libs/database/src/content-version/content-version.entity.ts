import { ContentEntryEntity } from '@database/content-entry/content-entry.entity';
import { UserEntity } from '@database/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('content_versions')
export class ContentVersionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ContentEntryEntity, { onDelete: 'CASCADE' })
  entry: ContentEntryEntity;

  @Column()
  version: number;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ nullable: true })
  publishedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, { nullable: true })
  createdBy: UserEntity;
}
