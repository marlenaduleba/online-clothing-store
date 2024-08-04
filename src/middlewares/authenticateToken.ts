import { Request, Response, NextFunction } from 'express';
import { verifyJWT, parseJWTPayload } from '../utils/jwt.js';
import { getUserById } from '../models/userModel.js';

declare global {
  namespace Express {
    interface Request {
      user?: any; // You can change `any` to the correct user type
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Unauthorized' });

  const secret = process.env.JWT_SECRET || 'secret';

  if (!verifyJWT(token, secret)) return res.status(403).json({ message: 'Forbidden' });

  const payload = parseJWTPayload(token);
  if (!payload) return res.status(403).json({ message: 'Forbidden' });

  try {
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
