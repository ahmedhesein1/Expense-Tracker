import express, { Express } from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './config/db';
// import {createDatabase} from './config/db';
import cors from 'cors';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { authRoutes } from './routes/auth.routes';
dotenv.config();
const app: Express = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
const initializeDatabase = async () => {
  try {
    // await createDatabase();
    await AppDataSource.initialize();
    console.log('✅ Database initialized');
    app.use('/auth', authRoutes);
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
app.use(globalErrorHandler);
initializeDatabase();
