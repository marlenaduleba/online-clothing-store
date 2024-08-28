import { createUser, getUserById, getAllUsers, updateUserById, deleteUserById } from '../models/userModel.js';
import bcrypt from 'bcrypt';

/**
 * Service to create a new user.
 *
 * @param userData - The data of the user to create.
 *
 * @returns The newly created user.
 */
export const createUserService = async (userData: any) => {
  const { first_name, last_name, email, password, role } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  return await createUser({ first_name, last_name, email, password: hashedPassword, role });
};

/**
 * Service to get all users.
 *
 * @returns An array of all users.
 */
export const getAllUsersService = async () => {
  return await getAllUsers();
};

/**
 * Service to get a user by their ID.
 *
 * @param id - The ID of the user to retrieve.
 *
 * @returns The user with the specified ID, or null if not found.
 */
export const getUserByIdService = async (id: number) => {
  return await getUserById(id);
};

/**
 * Service to update a user by their ID.
 *
 * @param id - The ID of the user to update.
 * @param userData - The new data for the user.
 *
 * @returns The updated user, or null if not found.
 */
export const updateUserService = async (id: number, userData: any) => {
  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  }
  return await updateUserById(id, userData);
};

/**
 * Service to delete a user by their ID.
 *
 * @param id - The ID of the user to delete.
 *
 * @returns void
 */
export const deleteUserService = async (id: number) => {
  return await deleteUserById(id);
};
