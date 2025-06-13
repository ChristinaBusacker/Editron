import { ContentVersionEntity } from '@database/content-version/content-version.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
} from 'typeorm';

@Entity('content_values')
export class ContentValueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentVersionEntity, { onDelete: 'CASCADE' })
  version: ContentVersionEntity;

  @Column('jsonb')
  value: any;
}
