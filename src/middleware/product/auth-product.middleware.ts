import { Injectable, NestMiddleware, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';

// Definimos una interfaz extendida para Request
interface CustomRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthProductMiddleware implements NestMiddleware {
  async use(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization token is missing.');
    }

    const token = authHeader.split(' ')[1]; // Extrae el token después de "Bearer"
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    try {
      const decoded: any = jwt.verify(token, JWT_SECRET); // Verifica el token

      const user = await User.findOne({ where: { id: decoded.id } }); // Busca el usuario en la base de datos

      if (!user) {
        throw new UnauthorizedException('Invalid token, user not found.');
      }
      console.log("user: ", user)
      console.log("userId: ", user.roleId); // Debugging
      if (Number(user.roleId) !== 2) { // 🔥 Asegurar que roleId es un número
        throw new ForbiddenException('Only sellers (roleId 2) can create products.');
      }

      req.user = user; // Agrega el usuario a la request
      next();
    } catch (error) {
      console.error('Middleware Error:', error);
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }
}
