import { Request, Response, NextFunction } from 'express';
import { verifyJWT, parseJWTPayload } from '../utils/jwt.js';
import { getUserById } from '../models/userModel.js';
import { isTokenBlacklisted } from '../models/tokenModel.js';

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can change `any` to the correct user type
    }
  }
}

/**
 * Middleware function to authenticate a user's JWT token.
 *
 * @param req - The request object containing the authorization header with the JWT token.
 * @param res - The response object to send an error message if authentication fails.
 * @param next - The next middleware function in the stack.
 *
 * @returns Proceeds to the next middleware if authentication is successful, otherwise returns an error response.
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Unauthorized' });

  const secret = process.env.JWT_SECRET || 'secret';

  if (!verifyJWT(token, secret)) return res.status(403).json({ message: 'Forbidden' });

  const payload = parseJWTPayload(token);
  if (!payload) return res.status(403).json({ message: 'Forbidden' });

  try {
    // Check if the token is blacklisted
    if (await isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Unauthorized - Token is blacklisted' });
    }

    const userId = parseInt(payload.sub, 10); // Ensure userId is a number
    const user = await getUserById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
