import { Request, Response, NextFunction } from 'express';
import { logMessages } from '../../../src/middlewares/logMessages';
import chalk from 'chalk';

describe('logMessages Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup mock request and response objects before each test
    mockRequest = {};
    mockResponse = {
      send: jest.fn(),
      statusCode: 200,
    };
    // Mock the next function
    mockNext = jest.fn();
    // Spy on console.log to check if logging is performed correctly
    logSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore the original console.log after each test
    logSpy.mockRestore();
  });

  it('should log a message in green for a successful response', () => {
    // Set status code to 200 (success)
    mockResponse.statusCode = 200;

    // Call the middleware
    logMessages(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Simulate sending a response with a success message
    const responseBody = JSON.stringify({ message: 'Success' });
    mockResponse.send!(responseBody);

    // Expect the message to be logged in green
    expect(logSpy).toHaveBeenCalledWith(chalk.green('Success'));
    // Expect the next middleware to be called
    expect(mockNext).toHaveBeenCalled();
  });

  it('should log a message in yellow for a client error response', () => {
    // Set status code to 400 (client error)
    mockResponse.statusCode = 400;

    // Call the middleware
    logMessages(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Simulate sending a response with an error message
    const responseBody = JSON.stringify({ message: 'Bad Request' });
    mockResponse.send!(responseBody);

    // Expect the message to be logged in yellow
    expect(logSpy).toHaveBeenCalledWith(chalk.yellow('Bad Request'));
    // Expect the next middleware to be called
    expect(mockNext).toHaveBeenCalled();
  });

  it('should log a message in white for other status codes', () => {
    // Set status code to 500 (server error)
    mockResponse.statusCode = 500;

    // Call the middleware
    logMessages(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Simulate sending a response with an error message
    const responseBody = JSON.stringify({ message: 'Internal Server Error' });
    mockResponse.send!(responseBody);

    // Expect the message to be logged in white (for other status codes)
    expect(logSpy.mock.calls[0][0]).toMatch('Internal Server Error');
    // Expect the next middleware to be called
    expect(mockNext).toHaveBeenCalled();
  });

  it('should pass errors to the global error handler', () => {
    const mockError = new Error('Test Error');

    // Call the middleware
    logMessages(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    // Simulate an error being passed to the next middleware
    mockNext(mockError);

    // Expect the error to be passed to the next function (global error handler)
    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
