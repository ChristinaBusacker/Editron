import { ContentEntryEntity } from '@database/content-entry/content-entry.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('content_versions')
export class ContentVersionEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
}
