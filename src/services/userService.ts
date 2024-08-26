import { createUser, getUserById, getAllUsers, updateUserById, deleteUserById } from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const createUserService = async (userData: any) => {
  const { first_name, last_name, email, password, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser({ first_name, last_name, email, password: hashedPassword, role });
};

export const getAllUsersService = async () => {
  return await getAllUsers();
};

export const getUserByIdService = async (id: number) => {
  return await getUserById(id);
};

export const updateUserService = async (id: number, userData: any) => {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  return await updateUserById(id, userData);
};

export const deleteUserService = async (id: number) => {
  return await deleteUserById(id);
};
