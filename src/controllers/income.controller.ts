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

  public deleteIncome = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const userId = req.user?.id;
      const incomeId = parseInt(req.params.id);
      if (!userId)
        return next(
          new AppError('You are not Authorized', 401),
        );
      const income: Income | null =
        await this.incomeRepository.findOne({
          where: {
            id: incomeId,
            user: { id: userId },
          },
        });
      if (!income)
        return next(
          new AppError(
            'You are not Authorized or Income not found',
            404,
          ),
        );
      await this.incomeRepository.remove(income);
      res.status(200).json({
        success: true,
        message: 'Income deleted successfully',
      });
    },
  );
}
export const incomeController = new IncomeController();
