import { ContentSchemaDefinition } from '@shared/declarations/interfaces/content/content-schema-definition';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinTable,
  ManyToMany,
} from 'typeorm';

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

  @ManyToMany(() => ContentSchemaEntity, { cascade: true })
  @JoinTable({
    name: 'cms_module_extension',
    joinColumn: {
      name: 'module_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'extension_id',
      referencedColumnName: 'id',
    },
  })
  extensions: ContentSchemaEntity[];

  @ManyToMany(() => ContentSchemaEntity, module => module.extensions)
  usedByModules: ContentSchemaEntity[];
}
