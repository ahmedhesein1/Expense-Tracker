import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { getDashboardData } from '../controllers/dashboard.controller';
export const dashboardRoutes = Router();

dashboardRoutes.get(
  '/',
  authController.protect,
  getDashboardData,
);
