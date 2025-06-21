import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { UserEntity } from '@database/user/user.entity';
import { customAlphabet } from 'nanoid';

const generateId = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  12,
);

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

  @Column()
  size: number;

  @Column({ nullable: true })
  width?: number;

  @Column({ nullable: true })
  height?: number;

  @Column({ nullable: true })
  hash?: string;

  @Column('jsonb', { default: {} })
  variants: Record<string, string>;

  @ManyToOne(() => UserEntity, { nullable: false })
  uploadedBy: UserEntity;

  @CreateDateColumn()
  uploadedAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = generateId();
  }
}
