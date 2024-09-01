import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import CustomError from "../errors/CustomError.js";

/**
 * Middleware to validate user registration data.
 */
export const validateRegister = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];

/**
 * Middleware to validate user login data.
 */
export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];

/**
 * Middleware to validate user creation data (Admin Only).
 */
export const validateUserCreation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("first_name").notEmpty().withMessage("First name is required"),
  body("last_name").notEmpty().withMessage("Last name is required"),
  body("role")
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];

/**
 * Middleware to validate user update data (Admin Only).
 */
export const validateUserUpdate = [
  body("email").optional().isEmail().withMessage("Invalid email format"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("first_name")
    .optional()
    .notEmpty()
    .withMessage("First name is required"),
  body("last_name").optional().notEmpty().withMessage("Last name is required"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either user or admin"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];

/**
 * Middleware to validate data for adding an item to the cart.
 */
export const validateAddItemToCart = [
  body("product_id").isInt().withMessage("Product ID must be an integer"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];

/**
 * Middleware to validate data for updating a cart item.
 */
export const validateUpdateCartItem = [
  body("cart_item_id").isInt().withMessage("Cart Item ID must be an integer"),
  body("quantity").isInt({ min: 1 }).withMessage("Quantity must be at least 1"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];

/**
 * Middleware to validate data for creating an order.
 */
export const validateCreateOrder = [
  body("items").isArray().withMessage("Items must be an array"),
  body("items.*.product_id")
    .isInt()
    .withMessage("Product ID must be an integer"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  body("items.*.price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];

/**
 * Middleware to validate data for updating an order.
 */
export const validateUpdateOrder = [
  body("total")
    .isFloat({ min: 0 })
    .withMessage("Total must be a positive number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new CustomError("Validation Error", 400, errors.array());
      return next(error);
    }
    next();
  },
];
