import { UserEntity } from '@database/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity('assets')
export class AssetEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  originalFilename: string;

  @Column()
  storedFilename: string;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  blurhash?: string;

  @Column()
  size: number;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ nullable: true })
  hash?: string;

  @Column('jsonb', { nullable: true })
  variants: Record<string, { webp: string; fallback: string }>;

  @ManyToOne(() => UserEntity, { nullable: false })
  uploadedBy: UserEntity;

  @CreateDateColumn()
  uploadedAt: Date;
}
