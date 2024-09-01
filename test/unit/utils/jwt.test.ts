import crypto from "crypto";
import { createJWT, verifyJWT, parseJWTPayload } from "../../../src/utils/jwt";
import CustomError from "../../../src/errors/CustomError";

jest.mock("crypto", () => ({
  createHmac: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn().mockReturnValue("mocked_signature"),
  })),
}));

describe("JWT Utility", () => {
  const secret = "test_secret";
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: "1234567890",
    name: "John Doe",
    iat: Math.floor(Date.now() / 1000),
  };

  it("should create a valid JWT token", () => {
    const token = createJWT(header, payload, secret);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const [headerB64, payloadB64, signature] = token.split(".");
    expect(headerB64).toBeTruthy();
    expect(payloadB64).toBeTruthy();
    expect(signature).toBe("mocked_signature");
  });

  it("should verify a valid JWT token", () => {
    const token = createJWT(header, payload, secret);
    const isValid = verifyJWT(token, secret);
    expect(isValid).toBe(true);
  });

  it("should parse the JWT payload correctly", () => {
    const token = createJWT(header, payload, secret);
    const parsedPayload = parseJWTPayload(token);
    expect(parsedPayload).toEqual(expect.objectContaining(payload));
  });

  it("should throw an error for a JWT token with incorrect signature", () => {
    const token = createJWT(header, payload, secret);
    // Modify the payload part of the token
    const parts = token.split(".");
    parts[1] = "tamperedPayload";
    const tamperedToken = parts.join(".");

    expect(() => verifyJWT(tamperedToken, secret)).toThrow(CustomError);
    expect(() => verifyJWT(tamperedToken, secret)).toThrow(
      "Failed to verify JWT"
    );
  });

  it("should throw an error for an expired JWT token", () => {
    const expiredPayload = {
      ...payload,
      exp: Math.floor(Date.now() / 1000) - 10,
    };
    const token = createJWT(header, expiredPayload, secret);
    expect(() => verifyJWT(token, secret)).toThrow(CustomError);
    expect(() => verifyJWT(token, secret)).toThrow("JWT has expired");
  });

  it("should create a JWT token with a default expiration", () => {
    const token = createJWT(header, { ...payload }, secret);
    const [headerB64, payloadB64] = token.split(".");
    const decodedPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );

    expect(decodedPayload.exp).toBeGreaterThan(decodedPayload.iat);
  });

  it("should throw an error for invalid JWT token format", () => {
    const invalidToken = "invalid.token.format";
    expect(() => verifyJWT(invalidToken, secret)).toThrow(CustomError);
    expect(() => verifyJWT(invalidToken, secret)).toThrow(
      "Invalid JWT signature"
    );
  });
});
