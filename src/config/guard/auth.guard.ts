import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
const { JWT_SECRET } = process.env;

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request | any = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is missing.');
    }

    const token = authHeader.split(' ')[1];

    if (!JWT_SECRET) {
      throw new UnauthorizedException('JWT_SECRET is not defined.');
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // 🔥 Adjunta la información del usuario al request
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
