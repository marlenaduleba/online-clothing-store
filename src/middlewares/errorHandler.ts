import chalk from "chalk";
import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError.js";

/**
 * Middleware function to handle errors in the application.
 *
 * This function captures errors that occur during the request-response cycle and sends an appropriate
 * response to the client. It distinguishes between custom errors and generic errors, logging the necessary
 * details and ensuring that the correct status code and message are returned.
 *
 * @param err - The error object that was thrown.
 * @param req - The request object from the client.
 * @param res - The response object to send the error message.
 * @param next - The next middleware function in the stack.
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Skip logging for 404 errors
  if (res.statusCode !== 404) {
    console.error("Error stack:", err.stack);
  }

  // If headers have already been sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle CustomError instances
  if (err instanceof CustomError) {
    res
      .status(err.status)
      .json({ message: err.message, errors: err.errors || [] });
  } else {
    console.error(chalk.red(err.message || "An unknown error occurred"));
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};
