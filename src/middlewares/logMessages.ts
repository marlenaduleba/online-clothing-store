import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware function to log specific messages from JSON responses.
 *
 * This middleware intercepts the response's `send` method to check if the response body
 * contains a message or errors in JSON format. Depending on the HTTP status code of the response,
 * the message is logged with appropriate coloring for better visibility.
 *
 * @param req - The request object from the client.
 * @param res - The response object used to send the response to the client.
 * @param next - The next middleware function in the stack.
 */
export const logMessages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send.bind(res);

  res.send = function (body: any) {
    let messageToLog = null;

    // Check if the response is in JSON format
    const contentType = res.getHeader("Content-Type");
    const isJsonResponse =
      contentType && contentType.toString().includes("application/json");

    if (isJsonResponse && typeof body === "string") {
      try {
        const parsedBody = JSON.parse(body);
        if (parsedBody.message) {
          messageToLog = parsedBody.message;
        } else if (parsedBody.errors && parsedBody.errors.length) {
          messageToLog = parsedBody.errors
            .map((error: any) => error.msg)
            .join(", ");
        }
      } catch (error) {
        // Log error parsing JSON only if necessary, otherwise ignore it
        console.error("Error parsing JSON body:", error);
      }
    } else if (body && typeof body === "object") {
      if (body.message) {
        messageToLog = body.message;
      } else if (body.errors && body.errors.length) {
        messageToLog = body.errors.map((error: any) => error.msg).join(", ");
      }
    }

    if (messageToLog && res.statusCode !== 500) {
      let coloredMessage;
      if (res.statusCode >= 200 && res.statusCode < 300) {
        coloredMessage = chalk.green(messageToLog);
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        coloredMessage = chalk.gray(messageToLog);
      } else if (res.statusCode >= 400 && res.statusCode < 500) {
        coloredMessage = chalk.yellow(messageToLog);
      } else {
        coloredMessage = chalk.blue(messageToLog);
      }
      console.log(coloredMessage);
    }

    return originalSend(body);
  };

  next();
};
