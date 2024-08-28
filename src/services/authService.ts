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

/**
 * Registers a new user with the provided details.
 *
 * @param email - The email of the user.
 * @param password - The password of the user.
 * @param first_name - The first name of the user.
 * @param last_name - The last name of the user.
 *
 * @returns The newly created user's data, excluding the password.
 * @throws Error if a user with the given email already exists.
 */
export const registerUser = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string
) => {
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = await createUser({
    email,
    password,
    first_name,
    last_name,
    role: "user",
  });
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

/**
 * Logs in a user with the provided credentials.
 *
 * @param email - The email of the user.
 * @param password - The password of the user.
 *
 * @returns An object containing the JWT token, refresh token, and user role.
 * @throws Error if the credentials are invalid.
 */
export const loginUser = async (email: string, password: string) => {
  const user = await getUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
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
 * Refreshes the JWT token using a valid refresh token.
 *
 * @param refreshToken - The refresh token to use for generating a new JWT token.
 *
 * @returns An object containing the new JWT token and user role.
 * @throws Error if the refresh token is invalid or the user does not exist.
 */
export const refreshUserToken = async (refreshToken: string) => {
  const userId = await getRefreshTokenData(refreshToken);
  if (!userId) {
    throw new Error("Invalid refresh token");
  }

  const user = await getUserById(userId);
  if (!user) {
    throw new Error("User not found");
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
 * Logs out the user by blacklisting the JWT token and revoking the refresh token.
 *
 * @param token - The JWT token to blacklist.
 * @param refreshToken - The refresh token to revoke.
 *
 * @returns void
 */
export const logoutUser = async (token: string, refreshToken: string) => {
  await blacklistToken(token);
  await revokeRefreshToken(refreshToken);
};

/**
 * Retrieves the profile data of the current user.
 *
 * @param user - The user object.
 *
 * @returns The user's data, excluding the password.
 */
export const getCurrentUserProfile = async (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
