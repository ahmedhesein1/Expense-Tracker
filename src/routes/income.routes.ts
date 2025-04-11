import { Router } from 'express';
import { incomeController } from '../controllers/income.controller';
import { authController } from '../controllers/auth.controller';

export const incomeRoutes = Router();

incomeRoutes.post(
  '/add-income',
  authController.protect,
  incomeController.createIncome,
);
incomeRoutes.get(
  '/',
  authController.protect,
  incomeController.getAllIncomes,
);
incomeRoutes.delete(
  '/:id',
  authController.protect,
  incomeController.deleteIncome,
);
