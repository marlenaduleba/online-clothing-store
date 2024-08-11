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

export const logoutUser = async (token: string, refreshToken: string) => {
  await blacklistToken(token);
  await revokeRefreshToken(refreshToken);
};

export const getCurrentUserProfile = async (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
