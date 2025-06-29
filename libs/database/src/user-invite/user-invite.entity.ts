import { customAlphabet } from 'nanoid';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  21,
);

@Entity('user-inites')
export class UserInviteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: false })
  email: string;

  @Column({})
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  activated: boolean;

  @Column({ default: 'de' })
  language: string;

  @Column('text', { array: true, default: '{}' })
  permissions: string[];

  @Column({ unique: true })
  inviteCode: string;

  @BeforeInsert()
  generateInviteCode() {
    this.inviteCode = nanoid();
  }
}
