import {
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
  } from '../../../src/services/userService';
  import {
    createUser,
    getUserById,
    getAllUsers,
    updateUserById,
    deleteUserById,
  } from '../../../src/models/userModel';
  import bcrypt from 'bcrypt';
  
  // Mocking the user model methods
  jest.mock('../../../src/models/userModel', () => ({
    createUser: jest.fn(),
    getUserById: jest.fn(),
    getAllUsers: jest.fn(),
    updateUserById: jest.fn(),
    deleteUserById: jest.fn(),
  }));
  
  // Mocking bcrypt
  jest.mock('bcrypt', () => ({
    hash: jest.fn(),
  }));
  
  describe('User Service', () => {
    afterEach(() => {
      jest.clearAllMocks(); // Clear mocks after each test
    });
  
    describe('createUserService', () => {
      it('should hash the password and create a new user', async () => {
        const mockUserData = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          role: 'user',
        };
        const mockHashedPassword = 'hashedpassword123';
        const mockCreatedUser = { id: 1, ...mockUserData, password: mockHashedPassword };
  
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
        (createUser as jest.Mock).mockResolvedValue(mockCreatedUser);
  
        const result = await createUserService(mockUserData);
  
        // Ensure password was hashed
        expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
        // Ensure user was created with the hashed password
        expect(createUser).toHaveBeenCalledWith({ ...mockUserData, password: mockHashedPassword });
        // Validate the result
        expect(result).toEqual(mockCreatedUser);
      });
  
      it('should throw an error if user creation fails', async () => {
        const mockUserData = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@example.com',
          password: 'password123',
          role: 'user',
        };
        const mockError = new Error('Failed to create user');
  
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword123');
        (createUser as jest.Mock).mockRejectedValue(mockError);
  
        await expect(createUserService(mockUserData)).rejects.toThrow('Failed to create user');
      });
    });
  
    describe('getAllUsersService', () => {
      it('should retrieve all users', async () => {
        const mockUsers = [
          { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'user' },
          { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', role: 'admin' },
        ];
  
        (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);
  
        const result = await getAllUsersService();
  
        // Ensure all users are retrieved
        expect(getAllUsers).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockUsers);
      });
  
      it('should throw an error if user retrieval fails', async () => {
        const mockError = new Error('Failed to retrieve users');
  
        (getAllUsers as jest.Mock).mockRejectedValue(mockError);
  
        await expect(getAllUsersService()).rejects.toThrow('Failed to retrieve users');
      });
    });
  
    describe('getUserByIdService', () => {
      it('should retrieve a user by ID', async () => {
        const mockUser = { id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', role: 'user' };
  
        (getUserById as jest.Mock).mockResolvedValue(mockUser);
  
        const result = await getUserByIdService(1);
  
        // Ensure the user is retrieved by ID
        expect(getUserById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
      });
  
      it('should return null if the user is not found', async () => {
        (getUserById as jest.Mock).mockResolvedValue(null);
  
        const result = await getUserByIdService(999);
  
        expect(getUserById).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
      });
  
      it('should throw an error if user retrieval fails', async () => {
        const mockError = new Error('Failed to retrieve user');
  
        (getUserById as jest.Mock).mockRejectedValue(mockError);
  
        await expect(getUserByIdService(1)).rejects.toThrow('Failed to retrieve user');
      });
    });
  
    describe('updateUserService', () => {
      it('should hash the password and update the user', async () => {
        const mockUserData = { password: 'newpassword123' };
        const mockHashedPassword = 'hashednewpassword123';
        const mockUpdatedUser = { id: 1, ...mockUserData, password: mockHashedPassword };
  
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
        (updateUserById as jest.Mock).mockResolvedValue(mockUpdatedUser);
  
        const result = await updateUserService(1, mockUserData);
  
        // Ensure the password was hashed
        expect(bcrypt.hash).toHaveBeenCalledWith('newpassword123', 10);
        // Ensure the user was updated with the hashed password
        expect(updateUserById).toHaveBeenCalledWith(1, { ...mockUserData, password: mockHashedPassword });
        expect(result).toEqual(mockUpdatedUser);
      });
  
      it('should update the user without hashing the password if not provided', async () => {
        const mockUserData = { first_name: 'John', last_name: 'Doe' };
        const mockUpdatedUser = { id: 1, ...mockUserData };
  
        (updateUserById as jest.Mock).mockResolvedValue(mockUpdatedUser);
  
        const result = await updateUserService(1, mockUserData);
  
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(updateUserById).toHaveBeenCalledWith(1, mockUserData);
        expect(result).toEqual(mockUpdatedUser);
      });
  
      it('should throw an error if user update fails', async () => {
        const mockUserData = { first_name: 'John' };
        const mockError = new Error('Failed to update user');
  
        (updateUserById as jest.Mock).mockRejectedValue(mockError);
  
        await expect(updateUserService(1, mockUserData)).rejects.toThrow('Failed to update user');
      });
    });
  
    describe('deleteUserService', () => {
      it('should delete the user by ID', async () => {
        (deleteUserById as jest.Mock).mockResolvedValue(undefined);
  
        await deleteUserService(1);
  
        // Ensure the user was deleted by ID
        expect(deleteUserById).toHaveBeenCalledWith(1);
      });
  
      it('should throw an error if user deletion fails', async () => {
        const mockError = new Error('Failed to delete user');
  
        (deleteUserById as jest.Mock).mockRejectedValue(mockError);
  
        await expect(deleteUserService(1)).rejects.toThrow('Failed to delete user');
      });
    });
  });
  