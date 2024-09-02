import { Request, Response, NextFunction } from "express";
import {
  createUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services/userService.js";

/**
 * Creates a new user.
 *
 * @param req - The request object containing the user details.
 * @param res - The response object to confirm the user was created.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming the user was created.
 */
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves all users.
 *
 * @param req - The request object.
 * @param res - The response object to send the list of users.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the list of all users.
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieves a specific user by their ID.
 *
 * @param req - The request object containing the user ID.
 * @param res - The response object to send the user data.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with the user data, or an error message if the user is not found.
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByIdService(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Updates a specific user's data by their ID.
 *
 * @param req - The request object containing the updated user details.
 * @param res - The response object to confirm the user's data was updated.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming the user's data was updated.
 */
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByIdService(parseInt(req.params.id)); // Dodano sprawdzenie istnienia użytkownika
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await updateUserService(
      parseInt(req.params.id),
      req.body
    );
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    next(error);
  }
};

/**
 * Deletes a specific user by their ID.
 *
 * @param req - The request object containing the user ID.
 * @param res - The response object to confirm the user was deleted.
 * @param next - The next middleware function in the stack.
 *
 * @returns A response with a message confirming the user was deleted.
 */
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUserByIdService(parseInt(req.params.id)); // Dodano sprawdzenie istnienia użytkownika
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await deleteUserService(parseInt(req.params.id));
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
