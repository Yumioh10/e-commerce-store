/**
 * @description Custom error class for API operations.
 * Allows throwing errors with a specific HTTP status code and message.
 * This is caught by the global error.middleware.ts.
 */
export class ApiError extends Error {
  public status: number;
  public isOperational: boolean;

  /**
   * Creates an instance of ApiError.
   * @param status - The HTTP status code (e.g., 400 for Bad Request, 404 for Not Found).
   * @param message - The error message.
   * @param isOperational - True if the error is expected (e.g., validation failed), false for critical bugs.
   */
  constructor(
    status: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message); // Call the base Error class constructor

    this.status = status;
    this.isOperational = isOperational;

    // Preserve the correct stack trace for where our error was thrown (V8 specific)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}