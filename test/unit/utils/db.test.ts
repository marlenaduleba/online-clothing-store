import { query, closeConnection } from "../../../src/utils/db";
import pg from "pg";

// Mock the Pool instance from the 'pg' module
jest.mock("pg", () => {
  const mClient = {
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mClient) };
});

describe("Database Utility", () => {
  let pool: pg.Pool;

  beforeEach(() => {
    // Create a new Pool instance before each test
    pool = new pg.Pool();
  });

  afterEach(() => {
    // Clear all mock function calls after each test
    jest.clearAllMocks();
  });

  it("should execute a query with provided text and parameters", async () => {
    const mockQueryResult = { rows: [{ id: 1, name: "Test" }] };
    (pool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);

    // Execute the query with parameters
    const result = await query("SELECT * FROM users WHERE id = $1", [1]);

    // Verify that the query was executed with the correct parameters
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM users WHERE id = $1",
      [1]
    );
    expect(result).toEqual(mockQueryResult);
  });

  it("should execute a query with only text and no parameters", async () => {
    const mockQueryResult = { rows: [{ id: 1, name: "Test" }] };
    (pool.query as jest.Mock).mockResolvedValueOnce(mockQueryResult);

    // Execute the query without parameters
    const result = await query("SELECT * FROM users");

    // Verify that the query was executed with the correct text and no parameters
    expect(pool.query).toHaveBeenCalledWith("SELECT * FROM users", undefined);
    expect(result).toEqual(mockQueryResult);
  });

  it("should throw an error if query execution fails", async () => {
    const mockError = new Error("Query failed");
    (pool.query as jest.Mock).mockRejectedValueOnce(mockError);

    // Expect the query to throw an error
    await expect(query("SELECT * FROM users")).rejects.toThrow("Query failed");
  });

  it("should close the database connection", async () => {
    // Call the function to close the connection
    await closeConnection();

    // Verify that the connection was closed
    expect(pool.end).toHaveBeenCalled();
  });
});
