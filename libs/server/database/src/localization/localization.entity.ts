import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'localizations' })
export class LocalizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  key: string;

  @Column({ type: 'text', nullable: true })
  en: string;

  @Column({ type: 'text', nullable: true })
  de: string;

  @Column({ type: 'text', nullable: true })
  fr: string;
}
