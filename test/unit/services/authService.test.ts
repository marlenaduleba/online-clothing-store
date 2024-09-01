import {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
  getCurrentUserProfile,
} from "../../../src/services/authService.js";
import bcrypt from "bcrypt";
import {
  getUserByEmail,
  createUser,
  getUserById,
} from "../../../src/models/userModel.js";
import {
  getRefreshTokenData,
  saveRefreshToken,
  revokeRefreshToken,
  blacklistToken,
} from "../../../src/models/tokenModel.js";
import { createJWT } from "../../../src/utils/jwt.js";

// Mock the dependencies to isolate the unit tests
jest.mock("../../../src/models/userModel");
jest.mock("../../../src/models/tokenModel");
jest.mock("../../../src/utils/jwt");
jest.mock("bcrypt");

describe("authService", () => {
  // Define the secret key for JWT
  const secret = process.env.JWT_SECRET || "secret";

  afterEach(() => {
    // Clear mock calls after each test to avoid interference
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user", async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
      };
      (getUserByEmail as jest.Mock).mockResolvedValue(null);
      (createUser as jest.Mock).mockResolvedValue(mockUser);

      // Call the service function
      const result = await registerUser(
        "test@example.com",
        "password",
        "John",
        "Doe"
      );

      // Assertions
      expect(getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
        first_name: "John",
        last_name: "Doe",
        role: "user",
      });
      expect(result).toEqual({ id: 1, email: "test@example.com" });
    });

    it("should throw an error if user already exists", async () => {
      // Mock the case where the user already exists
      (getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });

      // Call the service function and expect an error
      await expect(
        registerUser("test@example.com", "password", "John", "Doe")
      ).rejects.toThrow("User already exists");

      // Assertions
      expect(getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(createUser).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("should log in a user with valid credentials", async () => {
      // Mock user data and valid credentials
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
        role: "user",
      };
      (getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (createJWT as jest.Mock).mockReturnValue("fake-jwt-token");
      (saveRefreshToken as jest.Mock).mockResolvedValue("fake-refresh-token");

      // Call the service function
      const result = await loginUser("test@example.com", "password");

      // Assertions
      expect(getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedpassword");
      expect(createJWT).toHaveBeenCalledWith(
        { alg: "HS256", typ: "JWT" },
        {
          sub: "1",
          name: "test@example.com",
          iat: expect.any(Number),
        },
        secret // Ensure the correct secret is used
      );
      expect(saveRefreshToken).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        token: "fake-jwt-token",
        refreshToken: "fake-refresh-token",
        role: "user",
      });
    });

    it("should throw an error if credentials are invalid", async () => {
      // Mock invalid credentials case
      (getUserByEmail as jest.Mock).mockResolvedValue(null);

      // Call the service function and expect an error
      await expect(loginUser("test@example.com", "password")).rejects.toThrow(
        "Invalid credentials"
      );

      // Assertions
      expect(getUserByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(createJWT).not.toHaveBeenCalled();
      expect(saveRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe("refreshUserToken", () => {
    it("should refresh the JWT token with a valid refresh token", async () => {
      // Mock valid refresh token and user data
      const mockUser = { id: 1, email: "test@example.com", role: "user" };
      (getRefreshTokenData as jest.Mock).mockResolvedValue(1);
      (getUserById as jest.Mock).mockResolvedValue(mockUser);
      (createJWT as jest.Mock).mockReturnValue("new-jwt-token");

      // Call the service function
      const result = await refreshUserToken("valid-refresh-token");

      // Assertions
      expect(getRefreshTokenData).toHaveBeenCalledWith("valid-refresh-token");
      expect(getUserById).toHaveBeenCalledWith(1);
      expect(createJWT).toHaveBeenCalledWith(
        { alg: "HS256", typ: "JWT" },
        {
          sub: "1",
          name: "test@example.com",
          iat: expect.any(Number),
        },
        secret // Ensure the correct secret is used
      );
      expect(result).toEqual({ token: "new-jwt-token", role: "user" });
    });

    it("should throw an error if the refresh token is invalid", async () => {
      // Mock invalid refresh token case
      (getRefreshTokenData as jest.Mock).mockResolvedValue(null);

      // Call the service function and expect an error
      await expect(refreshUserToken("invalid-refresh-token")).rejects.toThrow(
        "Invalid refresh token"
      );

      // Assertions
      expect(getRefreshTokenData).toHaveBeenCalledWith("invalid-refresh-token");
      expect(getUserById).not.toHaveBeenCalled();
      expect(createJWT).not.toHaveBeenCalled();
    });
  });

  describe("logoutUser", () => {
    it("should blacklist the token and revoke the refresh token", async () => {
      // Call the service function
      await logoutUser("jwt-token", "refresh-token");

      // Assertions
      expect(blacklistToken).toHaveBeenCalledWith("jwt-token");
      expect(revokeRefreshToken).toHaveBeenCalledWith("refresh-token");
    });
  });

  describe("getCurrentUserProfile", () => {
    it("should return the user profile without the password", async () => {
      // Mock user data
      const mockUser = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
        role: "user",
      };

      // Call the service function
      const result = await getCurrentUserProfile(mockUser);

      // Assertions
      expect(result).toEqual({
        id: 1,
        email: "test@example.com",
        role: "user",
      });
    });
  });
});
