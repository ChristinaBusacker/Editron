import { ContentSchemaEntity } from '@database/content-schema/content-schema.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity('content_entries')
export class ContentEntryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ContentSchemaEntity)
  schema: ContentSchemaEntity;

  @Column()
  key: string;
}
