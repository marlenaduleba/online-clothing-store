import { Request, Response, NextFunction } from 'express';
import { createUser, getUserByEmail, getUserById } from '../models/userModel.js';
import { getRefreshTokenData, revokeRefreshToken, blacklistToken, saveRefreshToken } from '../models/tokenModel.js'
import { createJWT } from '../utils/jwt.js';
import bcrypt from 'bcrypt';

// User Registration
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Check if the user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: `User already exists` });
    }

    // Create a new user
    const newUser = await createUser({ email, password, first_name, last_name, role: 'user' });

    // Exclude the password from the response
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({message: "User registered", userWithoutPassword});
  } catch (error) {
    next(error);
  }
};

// User Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createJWT(
      { alg: 'HS256', typ: 'JWT' },
      { sub: user.id.toString(), name: user.email, iat: Math.floor(Date.now() / 1000) },
      process.env.JWT_SECRET || 'secret'
    );

    const refreshToken = await saveRefreshToken(user.id);

    res.json({ message: 'Logged in', token, refreshToken });
  } catch (error) {
    next(error);
  }
};

// Refresh token endpoint
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const userId = await getRefreshTokenData(refreshToken);
    if (!userId) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = createJWT(
      { alg: 'HS256', typ: 'JWT' },
      { sub: user.id.toString(), name: user.email, iat: Math.floor(Date.now() / 1000) },
      process.env.JWT_SECRET || 'secret'
    );

    res.json({message: 'Token refreshed', token });
  } catch (error) {
    next(error);
  }
};

// User Logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await blacklistToken(token);
    const refreshToken = req.body.refreshToken; // Assuming refresh token is passed in request body
    await revokeRefreshToken(refreshToken);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Get Current User
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { password, ...userWithoutPassword } = req.user;
    res.json({message: 'User data retrieved successfully', userWithoutPassword});
  } catch (error) {
    next(error);
  }
};