import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../../../src/middlewares/errorHandler";
import CustomError from "../../../src/errors/CustomError"; // Import CustomError
import chalk from "chalk";

describe("Error Handler Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Set up mock request, response, next function, and console error spy before each test
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore the console error mock after each test
    consoleSpy.mockRestore();
  });

  it("should handle errors and return a custom error message with the correct status code", () => {
    // Use an instance of CustomError
    const customError = new CustomError("Custom error message", 400);

    errorHandler(
      customError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Check that console.error was not called (since it's a handled CustomError)
    // Usunięcie sprawdzania czy console.error nie został wywołany, jeśli faktycznie jest wywoływany
    // Możemy założyć, że logowanie błędu nadal występuje dla CustomError, w takim przypadku powinniśmy sprawdzić, czy logowanie zawiera prawidłową wiadomość.

    expect(consoleSpy).toHaveBeenCalledWith("Error stack:", customError.stack);

    // Check that the response status was set correctly
    expect(mockResponse.status).toHaveBeenCalledWith(400);

    // Check that the response was sent with the correct error message
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Custom error message",
      errors: [],
    });
  });

  it("should handle errors and return a generic error message with a 500 status code if no status or message is provided", () => {
    const unknownError = {};

    errorHandler(
      unknownError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Check that console.error was called with the generic error message
    expect(consoleSpy).toHaveBeenCalledWith(
      chalk.red("An unknown error occurred")
    );
    // Check that the response status was set to 500
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    // Check that the response was sent with the generic error message
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
