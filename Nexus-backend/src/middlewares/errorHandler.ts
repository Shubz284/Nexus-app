import { Request, Response, NextFunction } from "express";

interface MongooseValidationError extends Error {
  name: "ValidationError";
  errors: {
    [key: string]: { message: string };
  };
}

interface MongooseDuplicateKeyError extends Error {
  code: 11000;
  keyValue: { [key: string]: any };
}

interface MongooseCastError extends Error {
  name: "CastError";
  path: string;
  value: any;
}

type CustomError = MongooseValidationError | MongooseDuplicateKeyError | MongooseCastError | Error;

export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error for debugging purposes (optional)
  console.error(err.stack);

  // 1. Mongoose Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values((err as MongooseValidationError).errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    res.status(400).json({ success: false, message });
    return;
  }

  // 2. Mongoose Duplicate Key Error
  if ((err as MongooseDuplicateKeyError).code && (err as MongooseDuplicateKeyError).code === 11000) {
    const field = Object.keys((err as MongooseDuplicateKeyError).keyValue)[0];
    const message = `An account with that ${field} already exists.`;
    res.status(409).json({ success: false, message }); // 409 Conflict
    return;
  }

  // 3. Mongoose Cast Error
  if (err.name === "CastError") {
    const message = `Invalid ${(err as MongooseCastError).path}: ${(err as MongooseCastError).value}.`;
    res.status(400).json({ success: false, message });
    return;
  }

  // 4. Default to a generic 500 Internal Server Error
  res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again later.",
  });
}
