import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './config/db';
import cors from 'cors';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { authRoutes } from './routes/auth.routes';
import { incomeRoutes } from './routes/income.routes';
import { expenseRoutes } from './routes/expense.routes';
import path from 'path';
import { dashboardRoutes } from './routes/dashboard.routes';

dotenv.config();
const app: Express = express();

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads')), // Serve from project root/uploads
);

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/income', incomeRoutes);
app.use('/expense',expenseRoutes);
app.use('/dashboard', dashboardRoutes);
app.use(globalErrorHandler);

const port = process.env.PORT || 3000;

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database initialized');
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (error) {
    console.error(
      '❌ Error during database initialization:',
      error,
    );
    process.exit(1);
  }
};

initializeDatabase();
