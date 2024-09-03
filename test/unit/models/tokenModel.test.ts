import {
  saveRefreshToken,
  revokeRefreshToken,
  blacklistToken,
  isTokenBlacklisted,
  getRefreshTokenData,
} from "../../../src/models/tokenModel";
import { query } from "../../../src/utils/db";
import crypto from "crypto";

// Mocking the query function and crypto module
jest.mock("../../../src/utils/db", () => ({
  query: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomBytes: jest.fn(() => ({
    toString: jest.fn(() => "mockedToken"),
  })),
}));

describe("Token Model", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("revokeRefreshToken", () => {
    it("should revoke (delete) the refresh token", async () => {
      const mockToken = "mockedToken";

      // Mocking the query call
      (query as jest.Mock).mockResolvedValueOnce({});

      await revokeRefreshToken(mockToken);

      expect(query).toHaveBeenCalledWith(
        "DELETE FROM refresh_tokens WHERE token = $1",
        [mockToken]
      );
    });
  });

  describe("blacklistToken", () => {
    it("should add the token to the blacklist", async () => {
      const mockToken = "mockedToken";

      // Mocking the query call
      (query as jest.Mock).mockResolvedValueOnce({});

      await blacklistToken(mockToken);

      expect(query).toHaveBeenCalledWith(
        "INSERT INTO token_blacklist (token, revoked_at) VALUES ($1, NOW())",
        [mockToken]
      );
    });

    it("should throw an error if token cannot be blacklisted", async () => {
      const mockToken = "mockedToken";

      // Mocking query to throw an error
      (query as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to blacklist token")
      );

      await expect(blacklistToken(mockToken)).rejects.toThrow(
        "Could not blacklist token"
      );
    });
  });

  describe("isTokenBlacklisted", () => {
    it("should return true if the token is blacklisted", async () => {
      const mockToken = "mockedToken";

      // Mocking the query call to return a non-zero row count
      (query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });

      const result = await isTokenBlacklisted(mockToken);

      expect(query).toHaveBeenCalledWith(
        "SELECT 1 FROM token_blacklist WHERE token = $1",
        [mockToken]
      );
      expect(result).toBe(true);
    });

    it("should return false if the token is not blacklisted", async () => {
      const mockToken = "mockedToken";

      // Mocking the query call to return zero row count
      (query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

      const result = await isTokenBlacklisted(mockToken);

      expect(query).toHaveBeenCalledWith(
        "SELECT 1 FROM token_blacklist WHERE token = $1",
        [mockToken]
      );
      expect(result).toBe(false);
    });

    it("should throw an error if blacklist status cannot be checked", async () => {
      const mockToken = "mockedToken";

      // Mocking query to throw an error
      (query as jest.Mock).mockRejectedValueOnce(
        new Error("Failed to check blacklist")
      );

      await expect(isTokenBlacklisted(mockToken)).rejects.toThrow(
        "Could not check token blacklist"
      );
    });
  });

  describe("getRefreshTokenData", () => {
    it("should return user ID associated with a valid refresh token", async () => {
      const mockToken = "mockedToken";
      const mockUserId = 1;

      // Mocking the query call to return a valid user ID
      (query as jest.Mock).mockResolvedValueOnce({
        rows: [{ user_id: mockUserId }],
      });

      const result = await getRefreshTokenData(mockToken);

      expect(query).toHaveBeenCalledWith(
        "SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
        [mockToken]
      );
      expect(result).toBe(mockUserId);
    });

    it("should return null if the refresh token is invalid or expired", async () => {
      const mockToken = "mockedToken";

      // Mocking the query call to return no rows
      (query as jest.Mock).mockResolvedValueOnce({ rows: [] });

      const result = await getRefreshTokenData(mockToken);

      expect(query).toHaveBeenCalledWith(
        "SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()",
        [mockToken]
      );
      expect(result).toBeNull();
    });
  });
});
