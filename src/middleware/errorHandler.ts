import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError | z.ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err.message,
    });
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({
      status: 'fail',
      error: err.errors[0].message,
    });
  }

  // 开发环境下的详细错误信息
  if (process.env.NODE_ENV === 'development') {
    return res.status(500).json({
      status: 'error',
      error: err.message,
      stack: err.stack,
    });
  }

  // 生产环境下的通用错误信息
  return res.status(500).json({
    status: 'error',
    error: '服务器内部错误',
  });
}; 