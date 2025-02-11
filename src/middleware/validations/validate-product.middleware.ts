import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

@Injectable()
export class ValidateProductMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    await Promise.all([
      body('name').isString().notEmpty().withMessage('Invalid "name". It must be a non-empty string.').run(req),
      body('quantity')
        .isInt({ min: 0 })
        .withMessage('Invalid "quantity". It must be a positive integer.')
        .run(req),
      body('price')
        .isFloat({ min: 0 })
        .withMessage('Invalid "price". It must be a positive decimal number.')
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    next(); // ✅ Si todo está bien, pasa al siguiente middleware/controlador
  }
}
