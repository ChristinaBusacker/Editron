import { ContentVersionEntity } from '@database/content-version/content-version.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity('content_values')
export class ContentValueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentVersionEntity, { onDelete: 'CASCADE' })
  version: ContentVersionEntity;

  @Column()
  fieldName: string;

  @Column({ nullable: true })
  locale?: string;

  @Column('jsonb')
  value: any;
}
