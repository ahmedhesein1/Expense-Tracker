import { Router } from 'express';
import { incomeController } from '../controllers/income.controller';
import { authController } from '../controllers/auth.controller';

export const incomeRoutes = Router();
incomeRoutes.use(authController.protect);
incomeRoutes.post(
  '/add-income',
  incomeController.createIncome,
);
incomeRoutes.get('/', incomeController.getAllIncomes);
incomeRoutes.delete('/:id', incomeController.deleteIncome);
