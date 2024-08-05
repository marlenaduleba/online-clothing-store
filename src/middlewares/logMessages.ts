import { Request, Response, NextFunction } from 'express';

export const logMessages = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body) {
    // Log the response body to the console
    if (typeof body === 'string') {
      try {
        const parsedBody = JSON.parse(body);
        console.log('Response messages:', parsedBody);
      } catch (err) {
        console.log('Response body:', body);
      }
    } else {
      console.log('Response body:', body);
    }
    return originalSend.call(this, body);
  };

  next();
};
