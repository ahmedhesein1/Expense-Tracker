import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './config/db';
// import {createDatabase} from './config/db';
import cors from 'cors';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { authRoutes } from './routes/auth.routes';
dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/auth', authRoutes);
app.use(globalErrorHandler);
const port = process.env.PORT || 3000;
const initializeDatabase = async () => {
  try {
    // await createDatabase();
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
