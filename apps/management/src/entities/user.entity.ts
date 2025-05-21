import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ nullable: true })
  password!: string;

  @Column({ nullable: true })
  provider!: 'local' | 'google' | 'microsoft' | 'github';

  @Column({ nullable: true })
  providerId!: string;

  @Column()
  name!: string;
}
