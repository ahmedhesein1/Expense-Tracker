import { Income } from '../entities/income.entity';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/db';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { instanceToPlain } from 'class-transformer';
import AppError from '../middleware/AppError';

dotenv.config();
class IncomeController {
  private incomeRepository =
    AppDataSource.getRepository(Income);

  public createIncome = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const userId = req.user?.id;
      const { icon, amount, source, date } = req.body;
      if (!icon || !amount || !source || !date)
        return next(
          new AppError('All fields are required', 400),
        );

      const newIncome = this.incomeRepository.create({
        user: { id: userId },
        icon,
        source,
        amount: parseFloat(amount),
        date: new Date(date),
      });
      await this.incomeRepository.save(newIncome);

      res.status(201).json({
        success: true,
        data: instanceToPlain(newIncome),
      });
    },
  );

  public getAllIncomes = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const userId = req.user?.id;
      const incomes = await this.incomeRepository.find({
        where: { user: { id: userId } },
        order: {
          createdAt: 'DESC',
        },
      });
      if (!incomes)
        return next(
          new AppError('Could not fins any incomes', 404),
        );
      res.status(200).json({
        success: true,
        data: instanceToPlain(incomes),
      });
    },
  );
}
export const incomeController = new IncomeController();
