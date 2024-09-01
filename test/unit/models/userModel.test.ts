import {
    createUser,
    getUserByEmail,
    getUserById,
    updateUserById,
    deleteUserById,
  } from "../../../src/models/userModel";
  import { query } from "../../../src/utils/db";
  import bcrypt from "bcrypt";
  
  // Mocking bcrypt.hash function
  jest.mock("bcrypt", () => ({
    hash: jest.fn(),
  }));
  
  // Mocking the query function from the database utility
  jest.mock("../../../src/utils/db", () => ({
    query: jest.fn(),
  }));
  
  describe("User Model", () => {
    // Clear all mocks after each test to ensure no test affects another
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    describe("createUser", () => {
      it("should hash the password and create a new user", async () => {
        // Arrange: Prepare mock data and expected results
        const mockUser = {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "password123",
          role: "user",
        };
        const mockHashedPassword = "hashedpassword123";
        const mockResult = {
          rows: [{ id: 1, ...mockUser, password: mockHashedPassword }],
        };
  
        // Mocking bcrypt.hash to return a predefined hashed password
        (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);
        // Mocking the database query to return a new user
        (query as jest.Mock).mockResolvedValue(mockResult);
  
        // Act: Call the function under test
        const newUser = await createUser(mockUser);
  
        // Assert: Verify that bcrypt.hash was called correctly
        expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
        // Assert: Verify that the query was made with correct SQL and parameters
        expect(query).toHaveBeenCalledWith(
          "INSERT INTO users (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          ["John", "Doe", "john.doe@example.com", mockHashedPassword, "user"]
        );
        // Assert: Verify the returned user matches the expected result
        expect(newUser).toEqual(mockResult.rows[0]);
      });
    });
  
    describe("getUserByEmail", () => {
      it("should return a user when email exists", async () => {
        // Arrange: Prepare mock data
        const mockEmail = "john.doe@example.com";
        const mockUser = {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          email: mockEmail,
          password: "hashedpassword123",
          role: "user",
        };
        const mockResult = { rows: [mockUser] };
  
        // Mocking the query function to return the user
        (query as jest.Mock).mockResolvedValue(mockResult);
  
        // Act: Call the function under test
        const user = await getUserByEmail(mockEmail);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith(
          "SELECT * FROM users WHERE email = $1",
          [mockEmail]
        );
        // Assert: Verify the returned user matches the expected result
        expect(user).toEqual(mockUser);
      });
  
      it("should return null when email does not exist", async () => {
        // Arrange: Prepare mock data
        const mockEmail = "nonexistent@example.com";
        const mockResult = { rows: [] };
  
        // Mocking the query function to return an empty result
        (query as jest.Mock).mockResolvedValue(mockResult);
  
        // Act: Call the function under test
        const user = await getUserByEmail(mockEmail);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith(
          "SELECT * FROM users WHERE email = $1",
          [mockEmail]
        );
        // Assert: Verify that the function returns null when the user is not found
        expect(user).toBeNull();
      });
    });
  
    describe("getUserById", () => {
      it("should return a user when ID exists", async () => {
        // Arrange: Prepare mock data
        const mockId = 1;
        const mockUser = {
          id: mockId,
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "hashedpassword123",
          role: "user",
        };
        const mockResult = { rows: [mockUser] };
  
        // Mocking the query function to return the user
        (query as jest.Mock).mockResolvedValue(mockResult);
  
        // Act: Call the function under test
        const user = await getUserById(mockId);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [
          mockId,
        ]);
        // Assert: Verify the returned user matches the expected result
        expect(user).toEqual(mockUser);
      });
  
      it("should return null when ID does not exist", async () => {
        // Arrange: Prepare mock data
        const mockId = 999;
        const mockResult = { rows: [] };
  
        // Mocking the query function to return an empty result
        (query as jest.Mock).mockResolvedValue(mockResult);
  
        // Act: Call the function under test
        const user = await getUserById(mockId);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith("SELECT * FROM users WHERE id = $1", [
          mockId,
        ]);
        // Assert: Verify that the function returns null when the user is not found
        expect(user).toBeNull();
      });
    });
  
    describe("updateUserById", () => {
      it("should update a user and return the updated user", async () => {
        // Arrange: Prepare mock data
        const mockId = 1;
        const mockUser = {
          first_name: "John",
          last_name: "Doe",
          email: "john.doe@example.com",
          password: "hashedpassword123",
          role: "user",
        };
        const mockResult = { rows: [{ id: mockId, ...mockUser }] };
  
        // Mocking the query function to return the updated user
        (query as jest.Mock).mockResolvedValue(mockResult);
  
        // Act: Call the function under test
        const updatedUser = await updateUserById(mockId, mockUser);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith(
          "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, role = $5 WHERE id = $6 RETURNING *",
          [
            "John",
            "Doe",
            "john.doe@example.com",
            "hashedpassword123",
            "user",
            mockId,
          ]
        );
        // Assert: Verify the returned user matches the expected result
        expect(updatedUser).toEqual(mockResult.rows[0]);
      });
  
      it("should return null if user to update does not exist", async () => {
        // Arrange: Prepare mock data
        const mockId = 999;
        const mockUser = {
          first_name: "Nonexistent",
          last_name: "User",
          email: "nonexistent@example.com",
          password: "password123",
          role: "user",
        };
        const mockResult = { rows: [] };
  
        // Mocking the query function to return an empty result
        (query as jest.Mock).mockResolvedValue(mockResult);
  
        // Act: Call the function under test
        const updatedUser = await updateUserById(mockId, mockUser);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith(
          "UPDATE users SET first_name = $1, last_name = $2, email = $3, password = $4, role = $5 WHERE id = $6 RETURNING *",
          [
            "Nonexistent",
            "User",
            "nonexistent@example.com",
            "password123",
            "user",
            mockId,
          ]
        );
        // Assert: Verify that the function returns null when the user is not found
        expect(updatedUser).toBeNull();
      });
    });
  
    describe("deleteUserById", () => {
      it("should delete a user", async () => {
        const mockId = 1;
  
        // Mocking the query function, which does not return any rows
        (query as jest.Mock).mockResolvedValue({ rows: [] });
  
        // Act: Call the function under test
        await deleteUserById(mockId);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [
          mockId,
        ]);
      });
  
      it("should not return anything when user to delete does not exist", async () => {
        const mockId = 999;
  
        // Mocking the query function, which does not return any rows
        (query as jest.Mock).mockResolvedValue({ rows: [] });
  
        // Act: Call the function under test
        const result = await deleteUserById(mockId);
  
        // Assert: Verify that the query was made with the correct SQL and parameters
        expect(query).toHaveBeenCalledWith("DELETE FROM users WHERE id = $1", [
          mockId,
        ]);
        // Assert: Verify that the function does not return anything
        expect(result).toBeUndefined(); // Expecting undefined since the function returns void
      });
    });
  });
  