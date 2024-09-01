import { Request, Response, NextFunction } from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../../../src/controllers/userController';
import { createUserService, getAllUsersService, getUserByIdService, updateUserService, deleteUserService } from '../../../src/services/userService';

// Mock the service functions
jest.mock('../../../src/services/userService');

describe('User Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  // Set up mock objects before each test
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  // Clear mocks after each test to ensure no interference between tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    // Test case: Successfully create a user
    it('should create a new user and return user data', async () => {
      const mockUser = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'user' };
      (createUserService as jest.Mock).mockResolvedValue(mockUser);

      mockRequest.body = mockUser;

      await createUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(createUserService).toHaveBeenCalledWith(mockUser);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User created successfully', user: mockUser });
    });

    // Test case: Handle errors and call next with the error
    it('should handle errors and call next with the error', async () => {
      const mockError = new Error('Failed to create user');
      (createUserService as jest.Mock).mockRejectedValue(mockError);

      mockRequest.body = {};

      await createUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getAllUsers', () => {
    // Test case: Successfully retrieve all users
    it('should retrieve all users and return them', async () => {
      const mockUsers = [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'user' },
        { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane.doe@example.com', role: 'admin' },
      ];
      (getAllUsersService as jest.Mock).mockResolvedValue(mockUsers);

      await getAllUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(getAllUsersService).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUsers);
    });

    // Test case: Handle errors and call next with the error
    it('should handle errors and call next with the error', async () => {
      const mockError = new Error('Failed to retrieve users');
      (getAllUsersService as jest.Mock).mockRejectedValue(mockError);

      await getAllUsers(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('getUserById', () => {
    // Test case: Successfully retrieve a user by ID
    it('should retrieve a user by ID and return it', async () => {
      const mockUser = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'user' };
      (getUserByIdService as jest.Mock).mockResolvedValue(mockUser);

      mockRequest.params = { id: '1' };

      await getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(getUserByIdService).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });

    // Test case: Return 404 if the user is not found
    it('should return 404 if user is not found', async () => {
      (getUserByIdService as jest.Mock).mockResolvedValue(null);

      mockRequest.params = { id: '1' };

      await getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(getUserByIdService).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    // Test case: Handle errors and call next with the error
    it('should handle errors and call next with the error', async () => {
      const mockError = new Error('Failed to retrieve user');
      (getUserByIdService as jest.Mock).mockRejectedValue(mockError);

      mockRequest.params = { id: '1' }; // Ensure the ID is present in the params

      await getUserById(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('updateUser', () => {
    // Test case: Successfully update a user
    it('should update a user and return the updated user', async () => {
      const mockUser = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'user' };
      (updateUserService as jest.Mock).mockResolvedValue(mockUser);

      mockRequest.params = { id: '1' };
      mockRequest.body = { first_name: 'Johnny' };

      await updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(updateUserService).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User updated successfully', user: mockUser });
    });

    // Test case: Handle errors and call next with the error
    it('should handle errors and call next with the error', async () => {
      const mockError = new Error('Failed to update user');
      (updateUserService as jest.Mock).mockRejectedValue(mockError);

      mockRequest.params = { id: '1' }; // Ensure the ID is present in the params

      await updateUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });

  describe('deleteUser', () => {
    // Test case: Successfully delete a user
    it('should delete a user and return a success message', async () => {
      (deleteUserService as jest.Mock).mockResolvedValue(undefined);

      mockRequest.params = { id: '1' };

      await deleteUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(deleteUserService).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User deleted successfully' });
    });

    // Test case: Handle errors and call next with the error
    it('should handle errors and call next with the error', async () => {
      const mockError = new Error('Failed to delete user');
      (deleteUserService as jest.Mock).mockRejectedValue(mockError);

      mockRequest.params = { id: '1' }; // Ensure the ID is present in the params

      await deleteUser(mockRequest as Request, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});
