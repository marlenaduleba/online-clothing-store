import { Request, Response, NextFunction } from "express";
import chalk from "chalk";

/**
 * Middleware function to handle errors in the application.
 *
 * @param err - The error object containing the error details.
 * @param req - The request object.
 * @param res - The response object used to send the error message to the client.
 * @param next - The next middleware function in the stack.
 *
 * @returns Sends a JSON response with the error message and status code, or a generic message if no specific error details are provided.
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(chalk.red(err.message || 'An unknown error occurred'));
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};
