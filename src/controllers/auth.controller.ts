import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppDataSource } from '../config/db';
import { User } from '../entities/user.entity';
import asyncHandler from 'express-async-handler';
import AppError from '../middleware/AppError';
import { instanceToPlain } from 'class-transformer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

interface TokenPayload extends JwtPayload {
  id: string;
  role: string;
}
declare module 'express' {
  interface Request {
    user?: User;
  }
}

class AuthController {
  private userRepository =
    AppDataSource.getRepository(User);

  private generateToken = (id: string): string => {
    return jwt.sign(
      { id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h',
      },
    );
  };
  public signUp = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const { name, email, password, profileImageUrl } =
        req.body;
      if (!name || !email || !password)
        return next(
          new AppError('All Fields are Required', 400),
        );
      const user = await this.userRepository.findOneBy({
        email,
      });
      if (user)
        return next(
          new AppError(
            'User ALready exists Login instead',
            400,
          ),
        );
      const hashedPassword = await bcrypt.hash(
        password,
        12,
      );
      const newUser = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
        profileImageUrl,
      });
      await this.userRepository.save(newUser);
      res.status(201).json({
        success: true,
        data: instanceToPlain(newUser),
        token: this.generateToken(newUser.id.toString()),
      });
    },
  );

  public login = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const { email, password } = req.body;
      if (!email || !password)
        return next(
          new AppError('All fields are required', 400),
        );
      const user = await this.userRepository.findOneBy({
        email,
      });
      if (!user)
        return next(new AppError('User Not Found', 400));
      const isMatched = await bcrypt.compare(
        password,
        user.password,
      );
      if (!isMatched)
        return next(
          new AppError('Invalid Credentials', 400),
        );
      const token = this.generateToken(user.id);
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 3600000,
      });
      res.status(200).json({
        success: true,
        data: instanceToPlain(user),
        token,
      });
    },
  );
  public protect = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const token = req.cookies.token;
      if (!token)
        return next(
          new AppError('You are Not authorized', 400),
        );
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as TokenPayload;
      const user = await this.userRepository.findOneBy({
        id: decoded.id,
      });
      if (!user)
        return next(new AppError('User Not Found', 404));
      req.user = user;
      decoded
        ? next()
        : next(
            new AppError(
              'Session Expired Please Login Again',
              404,
            ),
          );
    },
  );
  public logout = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      res.clearCookie('token').status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    },
  );
  public getUserInfo = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      const user = await this.userRepository.findOneBy({
        id: req.params.id,
      });
      if (!user)
        return next(new AppError('User Not Found', 404));
      res.status(200).json({
        success: true,
        data: instanceToPlain(user),
      });
    },
  );
}
export const authController = new AuthController();
