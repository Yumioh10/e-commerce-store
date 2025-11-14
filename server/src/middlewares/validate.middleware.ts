import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ApiError } from '../utils/ApiError';

export const validateMiddleware = (
  type: any,
  skipMissingProperties = false
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToInstance(type, req.body);
    
    validate(dto, { skipMissingProperties }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        const message = errors.map((error: ValidationError) => 
          Object.values(error.constraints || {})
        ).join(', ');
        
        next(new ApiError(400, message));
      } else {
        req.body = dto; // Pass the validated and transformed body
        next();
      }
    });
  };
};