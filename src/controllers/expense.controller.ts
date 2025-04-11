import { Expense } from '../entities/expense.entity';
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/db';
import { instanceToPlain } from 'class-transformer';
import asyncHandler from 'express-async-handler';
import AppError from '../middleware/AppError';
import dotenv from 'dotenv';

dotenv.config();

class ExpenseController {
  private expenseRepository =
    AppDataSource.getRepository(Expense);
  public createExpense = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const userId = req.user?.id;
      const { icon, category, amount, date } = req.body;
      if (!icon || !category || !amount || !date)
        return next(
          new AppError('All Fields Are Required', 400),
        );
      const newExpense = this.expenseRepository.create({
        user: { id: userId },
        icon,
        category,
        amount,
        date: new Date(date),
      });
      await this.expenseRepository.save(newExpense);
      res.status(201).json({
        success: true,
        data: instanceToPlain(newExpense),
      });
    },
  );

  public getAllExpenses = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const userId = req.user?.id;
      const expenses = this.expenseRepository.find({
        where: { user: { id: userId } },
        order: {
          createdAt: 'DESC',
        },
      });
      if (!expenses)
        return next(new AppError('No Expenses found', 404));
      res.status(200).json({
        success: true,
        data: instanceToPlain(expenses),
      });
    },
  );

  public deleteExpense = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const userId = req.user?.id;
      const expenseId = parseInt(req.params.id);
      if (!userId)
        return next(
          new AppError('You are not Authorized', 401),
        );
      const expense: Expense | null =
        await this.expenseRepository.findOne({
          where: {
            id: expenseId,
            user: { id: userId },
          },
        });
      if (!expense)
        return next(
          new AppError(
            'You are not Authorized or Income not found',
            404,
          ),
        );
      await this.expenseRepository.remove(expense);
      res.status(200).json({
        success: true,
        message: 'Expense deleted successfully',
      });
    },
  );
}

export const expenseController = new ExpenseController();
