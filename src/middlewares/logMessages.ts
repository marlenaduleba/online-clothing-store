import { Request, Response, NextFunction } from "express";
const chalk = require("chalk");

/**
 * Middleware to log success messages and other non-error messages.
 *
 * This middleware overrides the `res.send` function to log specific messages from the response body.
 * Errors are passed to the global error handler middleware without additional logging.
 *
 * @param req - The request object.
 * @param res - The response object, which is modified to log messages.
 * @param next - The next middleware function in the stack.
 *
 * @returns Proceeds to the next middleware, logging messages as needed.
 */
export const logMessages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Save the original res.send function
  const originalSend = res.send.bind(res);

  // Override res.send to log messages
  res.send = function (body) {
    let messageToLog: string | null = null;

    // Check if the response body is a string
    if (typeof body === "string") {
      try {
        // Try to parse the body as JSON
        const parsedBody = JSON.parse(body);
        if (parsedBody.message) {
          messageToLog = parsedBody.message;
        } else if (parsedBody.errors && parsedBody.errors.length) {
          messageToLog = parsedBody.errors
            .map((error: any) => error.msg)
            .join(", ");
        }
      } catch (err) {
        // If JSON parsing fails, we keep the original body
      }
    } else if (body && typeof body === "object") {
      // If the body is an object, check for message or errors
      if (body.message) {
        messageToLog = body.message;
      } else if (body.errors && body.errors.length) {
        messageToLog = body.errors.map((error: any) => error.msg).join(", ");
      }
    }

    // Log the message if it exists
    if (messageToLog) {
      let coloredMessage: string;
      // Color the message green for success responses (200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        coloredMessage = chalk.green(messageToLog);
      } else if (res.statusCode >= 400 && res.statusCode < 500) {
        // Color the message yellow for client errors (400-499)
        coloredMessage = chalk.yellow(messageToLog);
      } else {
        // Color other messages blue
        coloredMessage = chalk.blue(messageToLog);
      }
      console.log(coloredMessage);
    }

    // Call the original send function with the body
    return originalSend(body);
  };

  // Call the next middleware in the stack
  next();
};
