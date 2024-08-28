import { query } from '../utils/db.js';
import bcrypt from 'bcrypt';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
}

/**
 * Creates a new user with the provided details.
 *
 * @param user - The user data, excluding the ID.
 *
 * @returns The newly created user.
 */
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { first_name, last_name, email, password, role } = user;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query<User>(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [first_name, last_name, email, hashedPassword, role]
  );

  return result.rows[0];
};

/**
 * Retrieves a user by their email address.
 *
 * @param email - The email address of the user.
 *
 * @returns The user with the specified email, or null if not found.
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};

/**
 * Retrieves a user by their ID.
 *
 * @param id - The ID of the user.
 *
 * @returns The user with the specified ID, or null if not found.
 */
export const getUserById = async (id: number): Promise<User | null> => {
  const result = await query<User>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
};

/**
 * Retrieves all users.
 *
 * @returns An array of all users.
 */
export const getAllUsers = async (): Promise<User[]> => {
  const result = await query<User>('SELECT * FROM users');
  return result.rows;
};

/**
 * Updates a user by their ID.
 *
 * @param id - The ID of the user to update.
 * @param user - The new data for the user.
 *
 * @returns The updated user, or null if not found.
 */
export const updateUserById = async (id: number, user: Partial<User>): Promise<User | null> => {
  const fields = Object.keys(user);
  const values = Object.values(user);
  const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

  const result = await query<User>(
    `UPDATE users SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return result.rows[0] || null;
};

/**
 * Deletes a user by their ID.
 *
 * @param id - The ID of the user to delete.
 *
 * @returns void
 */
export const deleteUserById = async (id: number): Promise<void> => {
  await query('DELETE FROM users WHERE id = $1', [id]);
};
