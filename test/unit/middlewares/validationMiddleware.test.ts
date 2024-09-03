import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import CustomError from "../../../src/errors/CustomError";
import {
  validateRegister,
  validateLogin,
  validateUserCreation,
  validateUserUpdate,
  validateAddItemToCart,
  validateUpdateCartItem,
  validateCreateOrder,
} from "../../../src/middlewares/validationMiddleware";

jest.mock("express-validator", () => {
  const originalModule = jest.requireActual("express-validator");
  return {
    ...originalModule,
    validationResult: jest.fn(),
  };
});

describe("Validation Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Set up mock request, response, and next function before each test
    mockRequest = {};
    mockResponse = {};
    mockNext = jest.fn();
    (validationResult as unknown as jest.Mock).mockClear();
  });

  // Utility function to run the middleware and handle asynchronous execution
  const runValidationMiddleware = async (middleware: any) => {
    for (const fn of middleware) {
      await fn(mockRequest as Request, mockResponse as Response, mockNext);
    }
  };

  // Set up the validation result for testing, either as valid or invalid
  const setupValidationError = (isValid: boolean) => {
    if (!isValid) {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => false,
        array: () => [{ msg: "Validation Error" }],
      });
    } else {
      (validationResult as unknown as jest.Mock).mockReturnValue({
        isEmpty: () => true,
      });
    }
  };

  // Test case for valid registration data
  it("should validate registration data and call next when valid", async () => {
    setupValidationError(true);

    await runValidationMiddleware(validateRegister);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(CustomError));
  });

  // Test case for invalid login data
  it("should validate login data and call next with error when invalid", async () => {
    setupValidationError(false);

    await runValidationMiddleware(validateLogin);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
  });

  // Test case for valid user creation data
  it("should validate user creation data and call next when valid", async () => {
    setupValidationError(true);

    await runValidationMiddleware(validateUserCreation);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(CustomError));
  });

  // Test case for invalid user update data
  it("should validate user update data and call next with error when invalid", async () => {
    setupValidationError(false);

    await runValidationMiddleware(validateUserUpdate);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
  });

  // Test case for valid add item to cart data
  it("should validate add item to cart data and call next when valid", async () => {
    setupValidationError(true);

    await runValidationMiddleware(validateAddItemToCart);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(CustomError));
  });

  // Test case for invalid update cart item data
  it("should validate update cart item data and call next with error when invalid", async () => {
    setupValidationError(false);

    await runValidationMiddleware(validateUpdateCartItem);

    expect(mockNext).toHaveBeenCalledWith(expect.any(CustomError));
  });

  // Test case for valid create order data
  it("should validate create order data and call next when valid", async () => {
    setupValidationError(true);

    await runValidationMiddleware(validateCreateOrder);

    expect(mockNext).toHaveBeenCalled();
    expect(mockNext).not.toHaveBeenCalledWith(expect.any(CustomError));
  });
});
