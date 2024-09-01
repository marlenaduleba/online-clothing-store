import * as crypto from "crypto";
import CustomError from "../errors/CustomError.js"; // Import CustomError

/**
 * Interface representing the header of a JWT.
 */
interface JwtHeader {
  alg: string;
  typ: string;
}

/**
 * Interface representing the payload of a JWT.
 */
interface JwtPayload {
  sub: string;
  name: string;
  iat: number;
  exp?: number; // Optional expiration time
  [key: string]: any;
}

const DEFAULT_EXPIRATION_TIME = 15 * 60; // Default expiration time: 15 minutes in seconds

/**
 * Creates a JSON Web Token (JWT) with the specified header, payload, and secret.
 *
 * @param header - The JWT header containing the algorithm and type.
 * @param payload - The JWT payload containing user data and optional expiration time.
 * @param secret - The secret key used to sign the token.
 * @returns The generated JWT as a string.
 */
export const createJWT = (
  header: JwtHeader,
  payload: JwtPayload,
  secret: string
): string => {
  if (!payload.exp) {
    payload.exp = Math.floor(Date.now() / 1000) + DEFAULT_EXPIRATION_TIME;
  }

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  const token = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("base64url");

  return `${token}.${signature}`;
};

/**
 * Verifies the validity of a JSON Web Token (JWT) using the provided secret.
 *
 * @param token - The JWT to be verified.
 * @param secret - The secret key used to verify the token's signature.
 * @returns True if the token is valid, otherwise throws an error.
 * @throws CustomError if the token's signature is invalid or the token has expired.
 */
export const verifyJWT = (token: string, secret: string): boolean => {
  try {
    const [headerB64, payloadB64, receivedSignature] = token.split(".");

    const signature = crypto
      .createHmac("sha256", secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    if (signature !== receivedSignature) {
      throw new CustomError("Invalid JWT signature", 403);
    }

    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new CustomError("JWT has expired", 403);
    }

    return true;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      throw new CustomError("Failed to verify JWT", 500);
    }
    throw error;
  }
};

/**
 * Parses the payload from a JSON Web Token (JWT).
 *
 * @param token - The JWT from which to parse the payload.
 * @returns The parsed payload as an object, or null if parsing fails.
 * @throws CustomError if the payload is invalid or the token is malformed.
 */
export const parseJWTPayload = (token: string): JwtPayload | null => {
  try {
    const [, payloadB64] = token.split(".");
    const payload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );
    return payload;
  } catch (error) {
    throw new CustomError("Invalid JWT payload", 400);
  }
};
