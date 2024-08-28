import { query } from '../utils/db.js';
import crypto from 'crypto';

// Type for refresh token
interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
}

/**
 * Generates and saves a new refresh token for a user.
 *
 * @param userId - The ID of the user for whom the refresh token is generated.
 *
 * @returns The generated refresh token as a string.
 */
export const saveRefreshToken = async (userId: number): Promise<string> => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Example: 30 days validity
  await query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [userId, refreshToken, expiresAt]);
  return refreshToken;
};

/**
 * Revokes (deletes) a refresh token from the database.
 *
 * @param token - The refresh token to be revoked.
 *
 * @returns void
 */
export const revokeRefreshToken = async (token: string): Promise<void> => {
  await query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

/**
 * Adds a token to the blacklist, preventing its future use.
 *
 * @param token - The token to be blacklisted.
 *
 * @returns void
 * @throws Error if the token cannot be blacklisted.
 */
export const blacklistToken = async (token: string): Promise<void> => {
  try {
    await query('INSERT INTO token_blacklist (token, revoked_at) VALUES ($1, NOW())', [token]);
  } catch (error) {
    console.error('Error blacklisting token:', error);
    throw new Error('Could not blacklist token');
  }
};

/**
 * Checks if a token is blacklisted.
 *
 * @param token - The token to check.
 *
 * @returns A boolean indicating whether the token is blacklisted.
 * @throws Error if the blacklist status cannot be checked.
 */
export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const result = await query('SELECT 1 FROM token_blacklist WHERE token = $1', [token]);
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error checking token blacklist:', error);
    throw new Error('Could not check token blacklist');
  }
};

/**
 * Retrieves the user ID associated with a valid (non-expired) refresh token.
 *
 * @param refreshToken - The refresh token to check.
 *
 * @returns The user ID associated with the refresh token, or null if the token is invalid or expired.
 */
export const getRefreshTokenData = async (refreshToken: string): Promise<number | null> => {
  const result = await query<{ user_id: number }>('SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()', [refreshToken]);
  return result.rows.length > 0 ? result.rows[0].user_id : null;
};
