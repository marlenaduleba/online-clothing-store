
import { Request, Response, NextFunction } from 'express';
import { register, login, refreshToken } from '../../../src/controllers/authController';
import { registerUser, loginUser, refreshUserToken } from '../../../src/services/authService';

// Mocking the authService functions
jest.mock('../../../src/services/authService', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  refreshUserToken: jest.fn(),
}));

describe('Auth Controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;
  
    beforeEach(() => {
      mockRequest = {};
      mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      mockNext = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks(); // Clear all mocks after each test
    });
  
    describe('register', () => {
      it('should register a user and return user data without password', async () => {
        // Arrange: Mock request body and authService response
        mockRequest.body = {
          email: 'john.doe@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        };
        const mockUserWithoutPassword = {
          id: 1,
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          role: 'user',
        };
        (registerUser as jest.Mock).mockResolvedValue(mockUserWithoutPassword);
  
        // Act: Call the register function
        await register(mockRequest as Request, mockResponse as Response, mockNext);
  
        // Assert: Verify status and JSON response
        expect(registerUser).toHaveBeenCalledWith(
          'john.doe@example.com',
          'password123',
          'John',
          'Doe'
        );
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'User registered',
          user: mockUserWithoutPassword,
        });
      });
  
      it('should handle errors and call next with the error', async () => {
        // Arrange: Mock request body and an error thrown by registerUser
        mockRequest.body = {
          email: 'john.doe@example.com',
          password: 'password123',
          first_name: 'John',
          last_name: 'Doe',
        };
        const mockError = new Error('Registration failed');
        (registerUser as jest.Mock).mockRejectedValue(mockError);
  
        // Act: Call the register function and handle error
        await register(mockRequest as Request, mockResponse as Response, mockNext);
  
        // Assert: Verify that next was called with the error
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('login', () => {
      it('should log in a user and return token and role', async () => {
        // Arrange: Mock request body and authService response
        mockRequest.body = {
          email: 'john.doe@example.com',
          password: 'password123',
        };
        const mockLoginResponse = {
          token: 'some-jwt-token',
          refreshToken: 'some-refresh-token',
          role: 'user',
        };
        (loginUser as jest.Mock).mockResolvedValue(mockLoginResponse);
  
        // Act: Call the login function
        await login(mockRequest as Request, mockResponse as Response, mockNext);
  
        // Assert: Verify JSON response
        expect(loginUser).toHaveBeenCalledWith('john.doe@example.com', 'password123');
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Logged in',
          ...mockLoginResponse,
        });
      });
  
      it('should handle errors and call next with the error', async () => {
        // Arrange: Mock request body and an error thrown by loginUser
        mockRequest.body = {
          email: 'john.doe@example.com',
          password: 'password123',
        };
        const mockError = new Error('Login failed');
        (loginUser as jest.Mock).mockRejectedValue(mockError);
  
        // Act: Call the login function and handle error
        await login(mockRequest as Request, mockResponse as Response, mockNext);
  
        // Assert: Verify that next was called with the error
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  
    describe('refreshToken', () => {
      it('should refresh a token and return a new one', async () => {
        // Arrange: Mock request body and authService response
        mockRequest.body = { refreshToken: 'some-refresh-token' };
        const mockNewToken = { token: 'new-jwt-token' };
        (refreshUserToken as jest.Mock).mockResolvedValue(mockNewToken);
  
        // Act: Call the refreshToken function
        await refreshToken(mockRequest as Request, mockResponse as Response, mockNext);
  
        // Assert: Verify JSON response
        expect(refreshUserToken).toHaveBeenCalledWith('some-refresh-token');
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Token refreshed',
          ...mockNewToken,
        });
      });
  
      it('should handle errors and call next with the error', async () => {
        // Arrange: Mock request body and an error thrown by refreshUserToken
        mockRequest.body = { refreshToken: 'some-refresh-token' };
        const mockError = new Error('Token refresh failed');
        (refreshUserToken as jest.Mock).mockRejectedValue(mockError);
  
        // Act: Call the refreshToken function and handle error
        await refreshToken(mockRequest as Request, mockResponse as Response, mockNext);
  
        // Assert: Verify that next was called with the error
        expect(mockNext).toHaveBeenCalledWith(mockError);
      });
    });
  });
  

