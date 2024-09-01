import { Request, Response, NextFunction } from 'express';
import { isAdmin } from '../../../src/middlewares/isAdmin';
import CustomError from '../../../src/errors/CustomError';

// Extending the Request type to include the `user` property
interface RequestWithUser extends Request {
  user?: { role?: string };
}

describe('isAdmin Middleware', () => {
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Initialize mock objects for request, response, and next function
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should call next with an error if user is not authenticated', () => {
    // Simulate an unauthenticated user by setting `user` to undefined
    mockRequest.user = undefined;

    // Call the isAdmin middleware
    isAdmin(mockRequest as RequestWithUser, mockResponse as Response, mockNext);

    // Check that next was called with a CustomError and appropriate status/message
    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect((mockNext as jest.Mock).mock.calls[0][0].status).toBe(403);
    expect((mockNext as jest.Mock).mock.calls[0][0].message).toBe('Forbidden - Admins only');
  });

  it('should call next with an error if user is not an admin', () => {
    // Simulate a non-admin user
    mockRequest.user = { role: 'user' };

    // Call the isAdmin middleware
    isAdmin(mockRequest as RequestWithUser, mockResponse as Response, mockNext);

    // Check that next was called with a CustomError and appropriate status/message
    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
    expect((mockNext as jest.Mock).mock.calls[0][0].status).toBe(403);
    expect((mockNext as jest.Mock).mock.calls[0][0].message).toBe('Forbidden - Admins only');
  });

  it('should call next without an error if user is an admin', () => {
    // Simulate an admin user
    mockRequest.user = { role: 'admin' };

    // Call the isAdmin middleware
    isAdmin(mockRequest as RequestWithUser, mockResponse as Response, mockNext);

    // Check that next was called without an error
    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(CustomError));
  });
});
