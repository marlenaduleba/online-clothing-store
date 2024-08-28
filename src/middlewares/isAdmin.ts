import { Request, Response, NextFunction } from 'express';

/**
 * Middleware function to check if the authenticated user is an admin.
 *
 * @param req - The request object containing the authenticated user's data.
 * @param res - The response object to send an error message if the user is not an admin.
 * @param next - The next middleware function in the stack.
 *
 * @returns Proceeds to the next middleware if the user is an admin, otherwise returns a 403 Forbidden error.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admins only' });
  }
  next();
};
