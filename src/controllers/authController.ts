import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  getCurrentUserProfile,
} from "../services/authService.js";

// User Registration
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    const userWithoutPassword = await registerUser(
      email,
      password,
      first_name,
      last_name
    );
    res
      .status(201)
      .json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
  } catch (error) {
    next(error);
  }
};

// User Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { token, refreshToken, role } = await loginUser(email, password);
    res.json({ message: "Login successful", token, refreshToken, role });
  } catch (error) {
    next(error);
  }
};

// Refresh token endpoint
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body;
    const { token, role } = await refreshUserToken(refreshToken);
    res.json({ message: "Token refreshed successfully", token, role });
  } catch (error) {
    next(error);
  }
};

// User Logout
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    await logoutUser(token, refreshToken);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

// Retrieve current user profile
export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userWithoutPassword = await getCurrentUserProfile(req.user);
    res.json({
      message: "User profile retrieved successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
