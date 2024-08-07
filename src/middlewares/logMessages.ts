import { Request, Response, NextFunction } from "express";
import chalk from "chalk";

export const logMessages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send;

  res.send = function (body) {
    let messageToLog = null;

    // Check if the response body is a string
    if (typeof body === "string") {
      try {
        // Try to parse the body as JSON
        const parsedBody = JSON.parse(body);
        if (parsedBody.message) {
          messageToLog = parsedBody.message;
        } else if (parsedBody.error && parsedBody.error.message) {
          messageToLog = parsedBody.error.message;
        }
      } catch (err) {
        // If JSON parsing fails, we keep the original body
      }
    } else if (body && typeof body === "object") {
      // If the body is an object, check for message or error.message
      if (body.message) {
        messageToLog = body.message;
      } else if (body.error && body.error.message) {
        messageToLog = body.error.message;
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
        // // Color other messages blue
        coloredMessage = chalk.blue(messageToLog);
      }
      console.log(coloredMessage);
    }

    // Call the original send function with the body
    return originalSend.call(this, body);
  };

  // Call the next middleware in the stack
  next();
};
