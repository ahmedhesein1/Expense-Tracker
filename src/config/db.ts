import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import { User } from '../entities/user.entity';
import { Income } from '../entities/income.entity';
import { Expense } from '../entities/expense.entity';
dotenv.config();
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  synchronize: true,
  entities: [User, Income, Expense],
});
