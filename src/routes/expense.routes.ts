import { Router } from 'express';
import { expenseController } from '../controllers/expense.controller';
import { authController } from '../controllers/auth.controller';

export const expenseRoutes = Router();

expenseRoutes.use(authController.protect);
expenseRoutes.post(
  '/add-expense',
  expenseController.createExpense,
);
expenseRoutes.get('/', expenseController.getAllExpenses);
expenseRoutes.delete(
  '/:id',
  expenseController.deleteExpense,
);
