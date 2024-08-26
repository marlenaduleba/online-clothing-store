import { Request, Response, NextFunction } from 'express';
import { createUserService, getAllUsersService, getUserByIdService, updateUserService, deleteUserService } from '../services/userService.js';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUserService(req.body);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsersService();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByIdService(parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await updateUserService(parseInt(req.params.id), req.body);
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUserService(parseInt(req.params.id));
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
