import { Request, Response, NextFunction } from "express";
import chalk from "chalk";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(chalk.red(err.message || 'An unknown error occurred'));
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};
