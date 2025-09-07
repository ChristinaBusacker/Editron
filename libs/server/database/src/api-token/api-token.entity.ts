import { ProjectEntity } from '@database/project/project.entity';
import { UserEntity } from '@database/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';
import { randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Entity('api-token')
export class ApiTokenEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => ProjectEntity, { onDelete: 'CASCADE', nullable: false })
  project: ProjectEntity;

  @Column({ unique: true, length: 32 })
  token: string;

  @ManyToOne(() => UserEntity, { nullable: true })
  createdBy: UserEntity;

  @ManyToOne(() => UserEntity, { nullable: true })
  updatedBy: UserEntity;

  @Column({ default: false })
  hasManagementAccess: boolean;

  @Column({ default: false })
  hasReadAccess: boolean;

  @Column({ default: false })
  hasWriteAccess: boolean;

  @Column('jsonb', { default: {} })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  settings: any;

  @BeforeInsert()
  generateToken() {
    if (!this.id) {
      this.id = uuidv4();
    }
    if (!this.token) {
      this.token = randomBytes(16).toString('hex');
    }
  }
}
