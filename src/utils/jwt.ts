import * as crypto from 'crypto';

interface JwtHeader {
  alg: string;
  typ: string;
}

interface JwtPayload {
  sub: string;
  name: string;
  iat: number;
  exp?: number; // Optional expiration time
  [key: string]: any;
}

const DEFAULT_EXPIRATION_TIME = 15 * 60; // Default expiration time: 15 minutes in seconds

/**
 * Creates a JSON Web Token (JWT) using the provided header, payload, and secret.
 *
 * @param header - The JWT header containing algorithm and type.
 * @param payload - The JWT payload containing claims.
 * @param secret - The secret key used to sign the token.
 *
 * @returns The signed JWT as a string.
 */
export const createJWT = (header: JwtHeader, payload: JwtPayload, secret: string): string => {
  // Set default expiration time if not provided
  if (!payload.exp) {
    payload.exp = Math.floor(Date.now() / 1000) + DEFAULT_EXPIRATION_TIME;
  }

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

  const token = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac('sha256', secret)
    .update(token)
    .digest('base64url');

  return `${token}.${signature}`;
};

/**
 * Verifies the validity of a JWT.
 *
 * @param token - The JWT string to verify.
 * @param secret - The secret key used to verify the token's signature.
 *
 * @returns A boolean indicating whether the JWT is valid.
 */
export const verifyJWT = (token: string, secret: string): boolean => {
  try {
    const [headerB64, payloadB64, receivedSignature] = token.split('.');

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest('base64url');

    if (signature !== receivedSignature) {
      return false;
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return false;
  }
};

/**
 * Parses the payload of a JWT.
 *
 * @param token - The JWT string to parse.
 *
 * @returns The parsed JWT payload as an object, or null if parsing fails.
 */
export const parseJWTPayload = (token: string): JwtPayload | null => {
  try {
    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf-8'));
    return payload;
  } catch (error) {
    console.error('Error parsing JWT payload:', error);
    return null;
  }
};
