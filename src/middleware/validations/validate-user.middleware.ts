import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

@Injectable()
export class ValidateUserMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    await Promise.all([
      body('username').isString().notEmpty().withMessage('Username is required').run(req),
      body('email').isEmail().withMessage('Invalid email format').run(req),
      body('password').isString().notEmpty().withMessage('Password is required').run(req),
      body('roleType')
        .isString()
        .isIn(['seller', 'customer'])
        .withMessage('roleType must be either "seller" or "customer"')
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new BadRequestException(errors.array());
    }

    next();
  }
}
