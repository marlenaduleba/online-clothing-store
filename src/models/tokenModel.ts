import { query } from '../utils/db.js';
import crypto from 'crypto';

// Type for refresh token
interface RefreshToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
}

export const saveRefreshToken = async (userId: number): Promise<string> => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Example: 30 days validity
  await query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [userId, refreshToken, expiresAt]);
  return refreshToken;
};

// Add function to remove refresh token from the database (for logout or invalidation)
export const revokeRefreshToken = async (token: string): Promise<void> => {
  await query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

export const blacklistToken = async (token: string): Promise<void> => {
  try {
    await query('INSERT INTO token_blacklist (token, revoked_at) VALUES ($1, NOW())', [token]);
  } catch (error) {
    console.error('Error blacklisting token:', error);
    throw new Error('Could not blacklist token');
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  try {
    const result = await query('SELECT 1 FROM token_blacklist WHERE token = $1', [token]);
    // Default rowCount to 0 if it's null
    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    console.error('Error checking token blacklist:', error);
    throw new Error('Could not check token blacklist');
  }
};

export const getRefreshTokenData = async (refreshToken: string): Promise<number | null> => {
  const result = await query<{ user_id: number }>('SELECT user_id FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()', [refreshToken]);
  return result.rows.length > 0 ? result.rows[0].user_id : null;
};
