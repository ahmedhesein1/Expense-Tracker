import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Income {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.incomes)
  user: User;
  @Column({
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  icon: string;
  @Column({
    nullable: false,
    type: 'varchar',
    length: 255,
  })
  source: string;
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  amount: number;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
}
