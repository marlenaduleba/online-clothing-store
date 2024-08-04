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

// Creating a new user
export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const { first_name, last_name, email, password, role } = user;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await query<User>(
    'INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [first_name, last_name, email, hashedPassword, role]
  );

  return result.rows[0];
};

// Downloading user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const result = await query<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};

// Get user by ID
export const getUserById = async (id: number): Promise<User | null> => {
  const result = await query<User>(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  return result.rows[0] || null;
};

