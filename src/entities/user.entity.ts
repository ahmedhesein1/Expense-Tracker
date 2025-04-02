import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
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
    select:false
  })
  @Exclude()
  password: string;
  @Column({
    type: 'varchar',
    length: 225,
    default: null,
  })
  profileImageUrl: string;
  @CreateDateColumn()
  createdAt: string;
  @UpdateDateColumn()
  updatedAt: string;
}
