import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeUpdate,
  Column,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { UserEntity } from '../user/user.entity';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Exclude()
  @ManyToOne(() => UserEntity, user => user.sessions, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Expose({ name: 'userId' })
  get userId(): string {
    return this.user ? this.user.id : '';
  }

  @Column()
  expiresAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
