import {
  getUserByEmail,
  createUser,
  getUserById,
} from "../models/userModel.js";
import {
  getRefreshTokenData,
  saveRefreshToken,
  revokeRefreshToken,
  blacklistToken,
} from "../models/tokenModel.js";
import { createJWT } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import CustomError from '../errors/CustomError.js';

/**
 * Registers a new user by creating a new user record in the database.
 * Throws an error if the user already exists or if the creation fails.
 *
 * @param email - The email of the user to be registered.
 * @param password - The plaintext password of the user.
 * @param first_name - The first name of the user.
 * @param last_name - The last name of the user.
 * @returns A promise that resolves to the newly created user's details (without the password).
 * @throws CustomError if the user already exists or if the creation fails.
 */
export const registerUser = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string
) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({
    email,
    password: hashedPassword,
    first_name,
    last_name,
    role: "user",
  });

  if (!newUser) {
    throw new CustomError("User creation failed", 500);
  }

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Authenticates a user by validating the provided credentials.
 * If successful, returns a JWT token and a refresh token.
 * Throws an error if the credentials are invalid.
 *
 * @param email - The email of the user trying to log in.
 * @param password - The plaintext password of the user.
 * @returns A promise that resolves to an object containing the JWT token, refresh token, and user role.
 * @throws CustomError if the credentials are invalid.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new CustomError("Invalid credentials", 401);
  }

  const token = createJWT(
    { alg: "HS256", typ: "JWT" },
    {
      sub: user.id.toString(),
      name: user.email,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET || "secret"
  );

  const refreshToken = await saveRefreshToken(user.id);
  return { token, refreshToken, role: user.role };
};

/**
 * Refreshes a JWT token using a valid refresh token.
 * If the refresh token is valid, generates a new JWT token.
 * Throws an error if the refresh token is invalid or if the user is not found.
 *
 * @param refreshToken - The refresh token used to obtain a new JWT token.
 * @returns A promise that resolves to an object containing the new JWT token and the user's role.
 * @throws CustomError if the refresh token is invalid or if the user is not found.
 */
export const refreshUserToken = async (refreshToken: string) => {
  const userId = await getRefreshTokenData(refreshToken);
  if (!userId) {
    throw new CustomError("Invalid refresh token", 401);
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const token = createJWT(
    { alg: "HS256", typ: "JWT" },
    {
      sub: user.id.toString(),
      name: user.email,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_SECRET || "secret"
  );

  return { token, role: user.role };
};

/**
 * Logs out a user by blacklisting their JWT token and revoking their refresh token.
 *
 * @param token - The JWT token to be blacklisted.
 * @param refreshToken - The refresh token to be revoked.
 * @returns A promise that resolves once the token has been blacklisted and the refresh token has been revoked.
 */
export const logoutUser = async (token: string, refreshToken: string) => {
  await blacklistToken(token);
  await revokeRefreshToken(refreshToken);
};

/**
 * Retrieves the current user's profile, excluding the password.
 *
 * @param user - The user object from which the profile is to be retrieved.
 * @returns The user's profile data, excluding the password.
 */
export const getCurrentUserProfile = async (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
