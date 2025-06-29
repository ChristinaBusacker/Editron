import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
  BeforeUpdate,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { SessionEntity } from '../session/session.entity';
import { PasswordResetEntity } from '../password-reset/password-reset.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  email: string;

  @Column({})
  name: string;

  @Column({ nullable: true })
  password: string;

  @UpdateDateColumn()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

  @OneToMany(() => SessionEntity, session => session.user)
  sessions: SessionEntity[];

  @OneToMany(() => PasswordResetEntity, passwordReset => passwordReset.user)
  passwordResets: PasswordResetEntity[];

  @Column({ default: false })
  activated: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ nullable: true })
  provider: string;

  @Column({ nullable: true })
  providerId: string;

  @Column({ default: 'de' })
  language: string;

  @Column('text', { array: true, default: '{}' })
  permissions: string[];

  @BeforeUpdate()
  updateLastActivity() {
    this.lastActivity = new Date();
  }
}
