import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, refreshUserToken, logoutUser, getCurrentUserProfile } from '../services/authService.js';

// User Registration

/**
 * Registers a new user with the provided details.
 *
 * @param req - The request object containing user details.
 * @param res - The response object to send the result of the registration.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message and the user data without the password.
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const userWithoutPassword = await registerUser(email, password, first_name, last_name);
    res.status(201).json({ message: "User registered", user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

// User Login

/**
 * Logs in a user with the provided email and password.
 *
 * @param req - The request object containing login credentials.
 * @param res - The response object to send the result of the login.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message, token, refreshToken, and user role.
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token, refreshToken, role } = await loginUser(email, password); 
    res.json({ message: 'Logged in', token, refreshToken, role }); 
  } catch (error) {
    next(error);
  }
};

// Refresh token endpoint

/**
 * Refreshes the authentication token using a valid refresh token.
 *
 * @param req - The request object containing the refresh token.
 * @param res - The response object to send the new authentication token.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message and the new authentication token.
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;
    const {token, role} = await refreshUserToken(refreshToken);
    res.json({ message: 'Token refreshed', token, role });
  } catch (error) {
    next(error);
  }
};

// User Logout

/**
 * Logs out the user and invalidates the refresh token.
 *
 * @param req - The request object containing the refresh token.
 * @param res - The response object to send the result of the logout.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming logout.
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { refreshToken } = req.body; 
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    await logoutUser(token, refreshToken);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves the current user's profile information.
 *
 * @param req - The request object containing the authenticated user's data.
 * @param res - The response object to send the user's profile data.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the user's profile data without the password.
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userWithoutPassword = await getCurrentUserProfile(req.user);
    res.json({ message: 'User data retrieved successfully', user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

