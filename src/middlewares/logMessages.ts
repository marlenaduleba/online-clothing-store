import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';

/**
 * Middleware to log messages and errors.
 *
 * This middleware overrides the `res.send` function to log specific messages from the response body
 * and handles errors by logging them with different colors based on the status code.
 *
 * @param req - The request object.
 * @param res - The response object, which is modified to log messages.
 * @param next - The next middleware function in the stack.
 *
 * @returns Proceeds to the next middleware, logging messages and errors as needed.
 */
export const logMessages = (req: Request, res: Response, next: NextFunction) => {
  // Save the original res.send function
  const originalSend = res.send;

  // Override res.send to log messages
  res.send = function (body) {
    let messageToLog: string | null = null;

    // Check if the response body is a string
    if (typeof body === 'string') {
      try {
        // Try to parse the body as JSON
        const parsedBody = JSON.parse(body);
        if (parsedBody.message) {
          messageToLog = parsedBody.message;
        } else if (parsedBody.errors && parsedBody.errors.length) {
          messageToLog = parsedBody.errors.map((error: any) => error.msg).join(', ');
        }
      } catch (err) {
        // If JSON parsing fails, we keep the original body
      }
    } else if (body && typeof body === 'object') {
      // If the body is an object, check for message or errors
      if (body.message) {
        messageToLog = body.message;
      } else if (body.errors && body.errors.length) {
        messageToLog = body.errors.map((error: any) => error.msg).join(', ');
      }
    }

    // Log the message if it exists
    if (messageToLog) {
      let coloredMessage: string;
      // Color the message green for success responses (200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        coloredMessage = chalk.green(messageToLog);
      // Color the message yellow for client error responses (400-499)
      } else if (res.statusCode >= 400 && res.statusCode < 500) {
        coloredMessage = chalk.yellow(messageToLog);
      } else {
        // Color other messages blue
        coloredMessage = chalk.white(messageToLog);
      }
      console.log(coloredMessage);
    }

    // Call the original send function with the body
    return originalSend.call(this, body);
  };

  // Save the original next function
  const originalNext = next;

  // Override next to handle errors
  const errorHandler = (err: any) => {
    // Log the error message
    if (err) {
      console.error(chalk.red(err.message || 'An unknown error occurred'));
    }

    // Call the original next function with the error
    originalNext(err);
  };

  // Call the next middleware in the stack
  next = (err?: any) => {
    if (err) {
      errorHandler(err);
    } else {
      originalNext();
    }
  };

  // Call the next middleware
  next();
};
