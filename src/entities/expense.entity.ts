import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: number;
  @ManyToOne(() => User, (user) => user.expenses)
  user: User;
  @Column({
    type: 'varchar',
    length: 225,
  })
  icon: string;
  @Column({
    type: 'varchar',
    length: 225,
    nullable: false,
  })
  category: string;
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
  updateAt: Date;
}
