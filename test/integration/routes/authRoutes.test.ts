import request from 'supertest';
import app from '../../../src/app.js';
import { getUserByEmail, getUserById } from '../../../src/models/userModel.js';
import { saveRefreshToken, getRefreshTokenData } from '../../../src/models/tokenModel.js';
import bcrypt from 'bcrypt';
import { createJWT } from '../../../src/utils/jwt.js';

// Mocking dependencies
jest.mock('../../../src/models/userModel.js', () => ({
  createUser: jest.fn(() => Promise.resolve({
    id: 1,
    email: 'test@example.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'user',
    password: 'hashedpassword',
  })),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
}));

jest.mock('../../../src/models/tokenModel.js', () => ({
    saveRefreshToken: jest.fn(),
    revokeRefreshToken: jest.fn(),
    blacklistToken: jest.fn(),
    getRefreshTokenData: jest.fn(),
    isTokenBlacklisted: jest.fn().mockResolvedValue(false), // Dodajemy zamockowanie tej funkcji
  }));
  

jest.mock('bcrypt');

// Test data
const testUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  role: 'user',
  password: 'hashedpassword',
};

const testSecret = process.env.JWT_SECRET || 'secret';
const testJWT = createJWT(
  { alg: "HS256", typ: "JWT" },
  {
    sub: testUser.id.toString(),
    name: testUser.email,
    iat: Math.floor(Date.now() / 1000),
  },
  testSecret
);

const testRefreshToken = 'fake-refresh-token';

// Setup mocks before each test
beforeEach(() => {
  (getUserByEmail as jest.Mock).mockResolvedValue(testUser);
  (bcrypt.compare as jest.Mock).mockResolvedValue(true);
  (saveRefreshToken as jest.Mock).mockResolvedValue(testRefreshToken);
  (getRefreshTokenData as jest.Mock).mockResolvedValue(testUser.id);
  (getUserById as jest.Mock).mockResolvedValue(testUser);
});

// Clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

describe('Integration Tests - Auth Routes', () => {
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      (getUserByEmail as jest.Mock).mockResolvedValue(null); // Simulate that the user does not exist

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not register a user if the email already exists', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /login', () => {
    it('should log in a user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token', testJWT);
      expect(response.body).toHaveProperty('refreshToken', testRefreshToken);
    });

    it('should not log in a user with invalid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simulate incorrect password

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });

  describe('POST /logout', () => {
    it('should log out a user and invalidate the tokens', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${testJWT}`)
        .send({ refreshToken: testRefreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    it('should not log out if no token is provided', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken: testRefreshToken });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('GET /me', () => {
    it('should get the current user profile', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${testJWT}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'User profile retrieved successfully');
      expect(response.body.user).toEqual({
        id: 1,
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'user',
      });
    });

    it('should not get the user profile if unauthorized', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('POST /refresh', () => {
    it('should refresh the token with a valid refresh token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: testRefreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Token refreshed successfully');
      expect(response.body).toHaveProperty('token', testJWT);
    });

    it('should not refresh the token with an invalid refresh token', async () => {
      (getRefreshTokenData as jest.Mock).mockResolvedValue(null); // Simulate invalid refresh token

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-refresh-token' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid refresh token');
    });
  });
});
