import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type ErrorSource = 'server' | 'client';

@Entity('error_log')
export class ErrorLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar', length: 16 })
  source!: ErrorSource;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  context!: string | null;

  @Index()
  @Column({ type: 'int', nullable: true })
  statusCode!: number | null;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'text', nullable: true })
  stack!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  meta!: Record<string, any> | null;

  @CreateDateColumn()
  createdAt!: Date;
}
