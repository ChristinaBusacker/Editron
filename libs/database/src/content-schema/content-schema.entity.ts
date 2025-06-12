import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('content_schemas')
export class ContentSchemaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  renderer: string;

  @Column('jsonb')
  definition: ContentSchemaDefinition;
}
