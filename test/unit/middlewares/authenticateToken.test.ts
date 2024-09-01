import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../../../src/middlewares/authenticateToken';
import { verifyJWT, parseJWTPayload } from '../../../src/utils/jwt';
import { getUserById } from '../../../src/models/userModel';
import { isTokenBlacklisted } from '../../../src/models/tokenModel';

jest.mock('../../../src/utils/jwt');
jest.mock('../../../src/models/userModel');
jest.mock('../../../src/models/tokenModel');

describe('authenticateToken Middleware', () => {
  const mockRequest = {} as Request;
  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    mockRequest.headers = {};
    statusMock = jest.fn().mockReturnValue(mockResponse);
    jsonMock = jest.fn().mockReturnValue(mockResponse);
    mockResponse.status = statusMock;
    mockResponse.json = jsonMock;
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header is present', async () => {
    // Test case for when the authorization header is missing
    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if the JWT verification fails', async () => {
    // Test case for when the JWT verification fails
    mockRequest.headers.authorization = 'Bearer invalidtoken';
    (verifyJWT as jest.Mock).mockReturnValue(false);

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 if the JWT payload is invalid', async () => {
    // Test case for when the JWT payload is invalid
    mockRequest.headers.authorization = 'Bearer validtoken';
    (verifyJWT as jest.Mock).mockReturnValue(true);
    (parseJWTPayload as jest.Mock).mockReturnValue(null);

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Forbidden' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is blacklisted', async () => {
    // Test case for when the token is blacklisted
    mockRequest.headers.authorization = 'Bearer validtoken';
    (verifyJWT as jest.Mock).mockReturnValue(true);
    (parseJWTPayload as jest.Mock).mockReturnValue({ sub: '1' });
    (isTokenBlacklisted as jest.Mock).mockResolvedValue(true);

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized - Token is blacklisted' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if the user is not found', async () => {
    // Test case for when the user associated with the token is not found
    mockRequest.headers.authorization = 'Bearer validtoken';
    (verifyJWT as jest.Mock).mockReturnValue(true);
    (parseJWTPayload as jest.Mock).mockReturnValue({ sub: '1' });
    (isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
    (getUserById as jest.Mock).mockResolvedValue(null);

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next if the token is valid and user is found', async () => {
    // Test case for successful token authentication
    const mockUser = { id: 1, name: 'John Doe' };
    mockRequest.headers.authorization = 'Bearer validtoken';
    (verifyJWT as jest.Mock).mockReturnValue(true);
    (parseJWTPayload as jest.Mock).mockReturnValue({ sub: '1' });
    (isTokenBlacklisted as jest.Mock).mockResolvedValue(false);
    (getUserById as jest.Mock).mockResolvedValue(mockUser);

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockRequest.user).toBe(mockUser);
    expect(mockNext).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('should handle errors and call next with the error', async () => {
    // Test case for error handling during token authentication
    const mockError = new Error('Test error');
    mockRequest.headers.authorization = 'Bearer validtoken';
    (verifyJWT as jest.Mock).mockReturnValue(true);
    (parseJWTPayload as jest.Mock).mockReturnValue({ sub: '1' });
    (isTokenBlacklisted as jest.Mock).mockRejectedValue(mockError);

    await authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockError);
  });
});
