import { ContentVersionEntity } from '@database/content-version/content-version.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('content_values')
export class ContentValueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentVersionEntity, { onDelete: 'CASCADE' })
  version: ContentVersionEntity;

  @Column('jsonb')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}
