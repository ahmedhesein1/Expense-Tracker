import { Exclude } from 'class-transformer';
import {
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Income } from './income.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    length: 225,
    unique: true,
  })
  name: string;
  @Column({
    type: 'varchar',
    length: 225,
    unique: true,
  })
  email: string;
  @Column({
    type: 'varchar',
    length: 225,
    select: false,
  })
  @Exclude()
  password: string;
  @Column({
    type: 'varchar',
    length: 225,
    default: null,
  })
  profileImageUrl: string;
  @OneToMany(() => Income, (income) => income.user)
  incomes: Income[];
  @CreateDateColumn()
  createdAt: string;
  @UpdateDateColumn()
  updatedAt: string;
}
