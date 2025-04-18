import { Request, Response, NextFunction } from 'express';
import { Expense } from '../entities/expense.entity';
import { Income } from '../entities/income.entity';
import { getRepository, Transaction } from 'typeorm';
import asyncHandler from 'express-async-handler';

// Dashboard Data
export const getDashboardData = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;

      // Get Repositories
      const incomeRepo = getRepository(Income);
      const expenseRepo = getRepository(Expense);

      // Get Totals
      const totalIncome = await incomeRepo
        .createQueryBuilder('income')
        .select('SUM(income.amount)', 'total')
        .where('income.userId  = :userId', { userId })
        .getRawOne();
      const totalExpense = await expenseRepo
        .createQueryBuilder('expense')
        .select('SUM(expense.amount)', 'total')
        .where('expense.userId = :userId', { userId })
        .getRawOne();

      // Get last 60 Days Income
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const last60DaysIncome = await incomeRepo
        .createQueryBuilder('income')
        .where('income.userId = :userId', { userId })
        .andWhere('income.date >= :sixtyDaysAgo', {
          sixtyDaysAgo,
        })
        .orderBy('income.date', 'DESC')
        .getMany();
      const totalIncomeLast60Days = last60DaysIncome.reduce(
        (sum, income) => sum + income.amount,
        0,
      );
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const last30DaysExpense = await expenseRepo
        .createQueryBuilder('expense')
        .where('expense.userId = :userId', { userId })
        .andWhere('expense.date >= :thirtyDaysAgo', {
          thirtyDaysAgo,
        })
        .orderBy('expense.date', 'DESC')
        .getMany();
      const totalExpenseLast30Days =
        last60DaysIncome.reduce(
          (sum, expense) => sum + expense.amount,
          0,
        );

      // Get recent Transaction last 5 days
      const recentIncomes = await incomeRepo.find({
        where: { user: { id: userId } },
        order: { date: 'DESC' },
        take: 5,
      });

      const recentExpense = await expenseRepo.find({
        where: { user: { id: userId } },
        order: { date: 'DESC' },
        take: 5,
      });

      const recentTransactions = [
        ...recentIncomes.map((income) => ({
          ...income,
          type: 'income',
        })),
        ...recentExpense.map((expense) => ({
          ...expense,
          type: 'expense',
        })),
      ]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

      // Return the dashboard data
      res.json({
        totals: {
          balance:
            (totalIncome?.total || 0) -
            (totalExpense?.total || 0),
          income: totalIncome?.total || 0,
          expense: totalExpense?.total || 0,
        },
        recentTransactions,
        incomeLast60Days: {
          total: totalIncomeLast60Days,
          transactions: last60DaysIncome,
        },
        expenseLast30Days: {
          total: totalExpenseLast30Days,
          transactions: last30DaysExpense,
        },
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      res
        .status(500)
        .json({ message: 'Error fetching dashboard data' });
    }
  },
);
